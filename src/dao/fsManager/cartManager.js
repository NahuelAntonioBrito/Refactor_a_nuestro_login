import fs from 'fs';
import ProductManager from './productManager.js';

const productManager = new ProductManager('./data/products.json')

class CartManager {
    #cart

    constructor(cart) {
        this.#cart = cart;
        this.#init();
    }

    async #init() {
        if(!fs.existsSync(this.#cart)){
            await fs.writeFileSync(this.#cart, JSON.stringify([], null, 2));
        }
    }

    #generateId(carts){
        return (carts.length === 0) ? 1 : carts[carts.length - 1].id + 1;
    }

    async createCart() {
        if(!fs.existsSync(this.#cart)) return 'ERROR, el archivo no existe';
        let data = await fs.promises.readFile(this.#cart, 'utf-8');
        let carts =JSON.parse(data);
        const cartToAdd = {id: this.#generateId(carts), products: []};
        carts.push(cartToAdd);
        await fs.promises.writeFile(this.#cart, JSON.stringify(carts, null, 2));
        return cartToAdd
    }

    async getProductFromCart(id) {
        if(!fs.existsSync(this.#cart))return 'ERROR, el archivo no existe';
        let data = await fs.promises.readFile(this.#cart, 'utf-8');
        let carts = JSON.parse(data);
        let cart = carts.find(item => item.id == id);
        if(!cart) return 'ERROR, carrito no encontrado';
        return cart 
    }

    async addProductToCart (cid, pid){
        if(!fs.existsSync(this.#cart))return 'ERROR, el archivo no existe';
        let product = await productManager.getProductById(pid);
        if(!product) return `ERROR, no existe el producto con ese id: ${pid}`;
        const cart = await this.getProductFromCart(cid);
        if (typeof cart == 'string') {
            return `ERROR, no existe el carrito con ese id: ${cid}`;
        }
        const productsIndex = cart.products.findIndex(item => item.product === pid);
        if(productsIndex > -1){
            cart.products[productsIndex].quantity += 1;
        } else {
            cart.products.push({product: pid, quantity: 1});
        }
        let data = await fs.promises.readFile(this.#cart, 'utf-8');
        let carts = JSON.parse(data);

        carts = carts.map(item => {
            if (item.id === cid){
                return cart;
            }else {
                return item;
            }
        })

        await fs.promises.writeFile(this.#cart, JSON.stringify(carts, null, 2));
        return cart
    }
}

export default CartManager