import { Router } from 'express';
import { getProducts } from '../dao/dbProducManager.js';
import { PORT } from '../app.js';
import { getProductFromCart } from './cart.router.js';
import { publicRoutes } from '../middlewares/auth.middleware.js';


const router = Router();

router.get('/', publicRoutes, async (req, res) => {
    const result = await getProducts( req, res );
    if(result.statuscode ===  200){
        const totalPages = []
        let link 
        for (let i = 1; i <= result.response.totalPages; i++){
            if(!req.query.page){
                link = `http://${req.hostname}:${PORT}${req.originalUrl}&page=${i}`
            } else {
                const modifiedUrl = req.originalUrl.replace(`page=${req.query.page}`, `page=${i}`)
                link = `http://${req.hostname}:${PORT}${modifiedUrl}`
            }
            totalPages.push( {page: i, link})
        }
        const fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;

        const user = req.session.user

        res.render('home', { user,
            products: result.response.payload,
            paginateInfo: {
                hasPrevPage: result.response.hasPrevPage,
                hasNextPage: result.response.hasNextPage,
                prevLink: result.response.prevLink,
                nextLink: result.response.nextLink,
                totalPages,
                page: totalPages, 
                link: fullUrl 
            }
        })
    }else{
        res.status(result.statuscode).json({status: 'error', error: result.response.error})
    }
    
})

router.get('/realTimeProducts', publicRoutes, async (req, res) => {
    const result = await getProducts(req, res);
    console.log(result)
    if( result.statuscode === 200){
        res.render('realTimeProducts', { products: result.response.payload })
    }else{
        res.status(result.statuscode).json({status: 'error', error: result.response.error})
    }
    
})

router.get('/:cid', publicRoutes, async(req, res) => {
    const result = await getProductFromCart(req, res)
    console.log(result)
    if( result.statusCode === 200){
        res.render('productsFromCart', { cart: result.response.payload })
    }else{
        res.status(result.statusCode).json({status: 'error', error: result.response.error})
    }
})


export default router