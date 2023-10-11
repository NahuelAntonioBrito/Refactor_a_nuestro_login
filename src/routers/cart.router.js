import { Router } from 'express';
import cartModel from '../dao/models/cart.model.js';
import productModel from '../dao/models/product.model.js';


const router = Router();

export const getProductFromCart = async (req, res) =>{
    try{
        const id = req.params.cid
        const result = await cartModel.findById(id).populate('products.product').lean()
        if(result === null){
            return{
                statusCode: 404,
                response:{ status: 'error', error: "Carrito no encontrado"}
            }
        }
        return{
            statusCode: 200,
            response:{ status: 'success', payload: result}
        }
    }catch(err){
        console.log(err.message)
    }
}

router.post('/', async( req, res) =>{
    try{
        const cart = await  cartModel.create({});
        res.status(201).json({ status: 'success', payload: cart })
    }catch(err){
        res.status(500).json({status: 'error', error: err.message});
    }
});

router.get('/:cid', async (req, res) => {
    const cartId = await getProductFromCart(req, res);
    if(!cartId){
        res.status(404).json({status: 'error', error: 'No Se Encontro El Producto'});
    }else{
        res.json({status: 'success', payload: cartId});
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            return res.status(404).json({ status: 'error', error: `El Carrito con el ID ${cartId} NO SE ENCONTRÓ` });
        }

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ status: 'error', error: `El Producto con el ID ${productId} NO SE ENCONTRÓ` });
        }

        const existingProduct = cart.products.find(item => item.product.equals(productId));

        if (existingProduct) {
            
            existingProduct.quantity++;
        } else {
            
            cart.products.push({
                product: productId,
                quantity: 1, 
            });
        }

        
        await cart.save();

        return res.status(200).json({ status: 'success', message: 'Producto agregado al carrito', cart });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
});

router.delete('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const cart = await cartModel.findById(cartId);

        if (!cart) {
            return res.status(404).json({ status: 'error', error: `El Carrito con el ID ${cartId} NO SE ENCONTRÓ` });
        }

        const product = await productModel.findById(productId);

        if (!product) {
            return res.status(404).json({ status: 'error', error: `El Producto con el ID ${productId} NO SE ENCONTRÓ` });
        }

        const productindex = cart.products.findIndex(item => item.product == productId)
        if(productindex === -1){
            return res.status(400).json({ status: 'error', error: `El producto con ID: ${productId} no se encontro el el carrito con ID: ${cartId}`})
        }else{
            cart.products = cart.products.filter(item => item.product.toString() !== productId)
        }

        const result = await cartModel.findByIdAndUpdate(cartId, cart, { returnDocument: 'after'})
        res.status(200).json({ status: 'success', payload: result})

    }catch(err){
        console.error(err.message);
        return res.status(500).json({ status: 'error', error: 'Error interno del servidor' });
    }
})

router.put('/:cid', async (req, res) => {
    try{
        const id = req.params.cid;
        const cart = await cartModel.findById(id)
        if(cart === null){
            return res.status(404).json({status: 'error', error: `El Carrito con el ID ${id} NO SE ENCONTRÓ` })
        }
    
        const products = req.body.products
        if(!products){
            return res.status(400).json({status: 'error', error: `El producto no es opcional` })
        }
    
        for( let i = 0; i < products.length; i++){
            if( !products[i].hasOwnProperty('product') || !products[i].hasOwnProperty('quantity')){
                return res.status(400).json({status: 'error', error: `El producto debe tener un ID o una QUANTITY valida` })
            }
            if( typeof products[i].quantity !== 'number'){
                return res.status(400).json({status: 'error', error: `El Quantity debe ser un numero` })
            }
            if( products[i].quantity === 0){
                return res.status(400).json({status: 'error', error: `Debe agregar una Quantity mayor a cero` })
            }
            const productToAdd = await productModel.findById(products[i].product)
            if( productToAdd === null){
                return res.status(400).json({status: 'error', error: `El producto con el ID: ${id} no existe` })
            }
        }
    
        cart.products = products
        const result = await cartModel.findByIdAndUpdate(id, cart, { returnDocument: 'after'})
        res.status(200).json({ status: 'success', payload: result})
    }catch(err){
        return res.status(500).json({ status: 'error', error: err.message });
    }
});

router.put('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    try {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({ status: 'error', error: `El Carrito con el ID ${cartId} NO SE ENCONTRÓ` });
        }

        const product = await productModel.findById(productId);
        if (!product) {
            return res.status(404).json({ status: 'error', error: `El Producto con el ID ${productId} NO SE ENCONTRÓ` });
        }

        const quantity = req.body.quantity
        if( typeof quantity !== 'number'){
            return res.status(400).json({status: 'error', error: `El Quantity debe ser un numero` })
        }
        if( quantity === 0){
            return res.status(400).json({status: 'error', error: `Debe agregar una Quantity mayor a cero` })
        }

        const update = {
            $set: { 'products.$[elem].quantity': quantity },
        };
        const options = {
            arrayFilters: [{ 'elem.product': productId }],
            new: true, 
        };

        const result = await cartModel.findByIdAndUpdate(cartId, update, options);
        res.status(200).json({ status: 'success', payload: result})

    }catch(err){
        return res.status(500).json({ status: 'error', error: err.message });
    }
})

router.delete('/:cid', async (req, res) => {
    try {
        const id = req.params.cid
        const cart = await cartModel.findById(id)
        if (!cart) {
            return res.status(404).json({ status: 'error', error: `El Carrito con el ID ${id} NO SE ENCONTRÓ` });
        }

        cart.products = []

        const result = await cartModel.findByIdAndUpdate(id, cart, { returnDocument: 'after'});
        res.status(200).json({ status: 'success', payload: result})

    }catch(err){
        return res.status(500).json({ status: 'error', error: err.message });
    }
})

export default router