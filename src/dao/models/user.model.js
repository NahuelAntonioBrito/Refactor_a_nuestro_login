import mongoose from "mongoose";

const userCollection = 'users'
const userSchema = new mongoose.Schema({
    firstName: {type: String},
    lastName: {type: String},
    email: {type: String},
    age: {type: Number},
    password: {type: String},
    role: String,
})

const userModel = mongoose.model(userCollection, userSchema)
export default userModel