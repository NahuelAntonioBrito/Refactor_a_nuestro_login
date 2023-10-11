import { Router } from 'express';
import { getProducts } from '../dao/dbProducManager.js';
import productModel from '../dao/models/product.model.js';

const router = Router();


router.get('/', async (req, res) => {
    const result = await getProducts( req, res )
    res.status(result.statuscode).json(result.response)
});

router.get('/:pid', async (req, res) => {

    try{
        const id = req.params.pid;
        const productId = await productModel.findById(id).lean().exec();
        if(!productId){
            res.status(404).json({status: 'error', error: 'No Se Encontro El Producto'});
    
        }else{
            res.json({status: 'success', payload: productId});
        }   
        
    }catch(err){
        console.log(err.message)
    }
})

router.post('/', async( req, res) =>{
    const product = req.body;
    const productAdd = await  productModel(product);
    console.log('Producto creado:', productAdd);
    try {
        await productAdd.save();
        res.json({ status: 'success', payload: productAdd });
    } catch (err) {
        console.error('Error al guardar el producto:', err);
        res.status(500).json({ status: 'error', error: 'No se pudo agregar el producto' });
    }
})

router.put('/:pid', async (req, res) => {
    const id = req.params.pid;
    const productUpdates = req.body;

    try {
        const updatedProduct = await productModel.findByIdAndUpdate(id, productUpdates, { new: true });

        if (updatedProduct) {
            res.json({ status: 'success', payload: updatedProduct });
        } else {
            res.status(404).json({ status: 'error', error: 'No se encontró el producto' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: 'error', error: 'Error en la actualización del producto' });
    }
});

router.delete('/:pid', async( req, res ) => {
    const id = req.params.pid;

    try {
        const deletProduct = await productModel.deleteOne( { _id: id })

        if (deletProduct) {
            res.json({ status: 'success', payload: deletProduct });
        } else {
            res.status(404).json({ status: 'error', error: 'No se encontró el producto' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ status: 'error', error: 'Error en la actualización del producto' });
    }

})

export default router