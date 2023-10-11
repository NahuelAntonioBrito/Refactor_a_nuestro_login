import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


const productsCollections = 'products';

const productSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: Number, required: true},
    thumbnails: [
        String
    ],
    status: {type: Boolean, required: true},
    code: {type: String, required: true},
    stock: {type: Number, required: true},
    category: {type: String, required: true},
})

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productsCollections, productSchema)

export default productModel