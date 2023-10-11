import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import { Server } from 'socket.io';
import session from 'express-session'
import MongoStore from "connect-mongo"
import passport from "passport";
import initializePassport from './config/passport.config.js'
import productsRouter from './routers/products.router.js'
import cartsRouter from './routers/cart.router.js'
import sessionRouter from './routers/session.router.js'
import sesssionViewRouter from './routers/session.view.router.js'
import viewsRouter from './routers/view.router.js'
import chatRouter from './routers/chat.router.js'
import { __dirname } from './utils.js';
import messageModel from "./dao/models/message.model.js";

const MONGO_URI = 'mongodb+srv://nahuelantoniobritogutierrez:ecomerce@ecomerce.jn3bnqj.mongodb.net/'
export const PORT = 8080;

const app = express();

app.engine('handlebars', handlebars.engine());
app.set('views', './src/views');
app.set('view engine', 'handlebars');

app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGO_URI,
        dbName: 'ecomerce'
    }),
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use(express.static(__dirname+"/public"));
app.use('/', sesssionViewRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartsRouter);
app.use('/api/sessions', sessionRouter);
app.use('/session', sessionRouter);
app.use('/products', viewsRouter);
app.use('/carts', viewsRouter);
app.use('/chat', chatRouter);

try{
    await mongoose.connect(MONGO_URI,{
        dbName: 'ecomerce',
        useUnifiedTopology : true
    })
    const httpServer = app.listen(PORT, ()=> console.log('Server up on port 8080')) 

    const io = new Server(httpServer);
    io.on("connection", (socket) => {
        console.log(`New Client Connected`)
        socket.on('productList', (data) => {
            // Supongamos que `data` contiene los datos de productos actualizados
            if (data) {
                io.emit('updateProducts', data);
                console.log('Datos enviados al cliente:', data);
            } else {
                console.error('Los datos de productos están vacíos o nulos');
            }
        })
        socket.on('message', async (data) => {
            try {
                const message = new messageModel({
                    user: data.user,
                    message: data.message
                });
        
                await message.save();
                const messages = await messageModel.find()
                io.emit('logs', messages);
            } catch (err) {
                console.error('Error al guardar el mensaje:', err);
            }
        });
        
    })
}catch(err){
    console.log(err.message)
}