import fs from 'fs';

class ProductManager {
    #products

    constructor(products) {
        this.#products = products;
        this.#init();
    }

    async #init() {
        if(!fs.existsSync(this.#products)){
            await fs.writeFileSync(this.#products, JSON.stringify([], null, 2));
        }
    }

    #generateId(products){
        return (products.length === 0) ? 1 : products[products.length - 1].id + 1;
    }

    async addProduct(product) {
    
        if (
            !product.title ||
            !product.description ||
            !product.price ||
            !product.thumbnail ||
            !product.code ||
            !product.category ||
            !product.stock
        )
            return "[ERR] require fields missing";
    
        if (!fs.existsSync(this.#products)) return "[ERR] DB file does not exists";
    
        let data = await fs.promises.readFile(this.#products, "utf-8");
        let products = JSON.parse(data);
        const found = products.find((i) => i.code === product.code);
    
        if (found) return "[ERR] code already exists";
        //hardcodeo el status en true:
        const productToAdd = { id: this.#generateId(products), status: true, ...product };
        products.push(productToAdd);
        
        await fs.promises.writeFile(this.#products, JSON.stringify(products, null, 2));
        return productToAdd;
    }

    async getProducts(){
        if(!fs.existsSync(this.#products)) return 'ERROR, el archivo no existe';
        let data = await fs.promises.readFile(this.#products, 'utf-8');
        let products =JSON.parse(data);
        return products
    };

    async getProductById (id) {
        if(!fs.existsSync(this.#products)) return 'ERROR, el archivo no existe';
        let data = await fs.promises.readFile(this.#products, 'utf-8');
        let products =JSON.parse(data);
        const productId = products.find(item => item.id === id)
        return productId
    };

    async updateProduct(id, updatedProduct) {
        if(!fs.existsSync(this.#products)) return 'ERROR, el archivo no existe';
        let data = await fs.promises.readFile(this.#products, 'utf-8');
        let products = JSON.parse(data);

        const productIndex = products.findIndex(item => item.id === id);
        if (productIndex === -1) {
            return 'ERROR, el producto no existe';
        }

        let updatedProductData = { ...products[productIndex], ...updatedProduct };
        products[productIndex] = updatedProductData;

        await fs.promises.writeFile(this.#products, JSON.stringify(products, null, 2));

        return updatedProductData;
    }

    async deleteProduct(id){
        if(!fs.existsSync(this.#products)) return 'ERROR, el archivo no existe';
        let found = false;
        let data = await fs.promises.readFile(this.#products, 'utf-8');
        let products = JSON.parse(data);
        let newProducts = products.filter(item => item.id !== id );
        if(products.length !== newProducts.length) found = true;
        if(!found)return 'ERROR, el producto no existe';
        await fs.promises.writeFile(this.#products, JSON.stringify(newProducts, null, 2));
        return newProducts;
    }

}

export default ProductManager