import productModel from "./models/product.model.js";
import { PORT } from "../app.js"


export const getProducts = async ( req, res ) =>{
    try{
        const limit = req.query.limit || 10 // Obtener el valor de "limit" de la consulta
        const page = req.query.page || 1   // Obtener el valor de "page" de la consulta

        const filterOptions = {}

        if(req.query.stock) filterOptions.stock = req.query.stock
        if(req.query.category) filterOptions.category = req.query.category

        const paginateOptions = { lean: true, limit, page };
        if(req.query.sort === 'asc') filterOptions.sort = { price: 1}
        if(req.query.sort === 'desc') filterOptions.sort = { price: -1}

        const result = await productModel.paginate( filterOptions, paginateOptions )

        //prevLink 

        let prevPageBaseURL = `http://${req.hostname}:${PORT}${req.originalUrl}`;
        let prevLink;

        if (result.hasPrevPage) {
            const pageParam = `page=${result.prevPage}`;
            if (prevPageBaseURL.includes('page=')) {
                // La URL ya contiene un parámetro "page", reemplaza el valor existente
                prevLink = prevPageBaseURL.replace(/page=\d+/, pageParam);
            } else {
                // Agrega el parámetro "page" a la URL
                if (prevPageBaseURL.includes('?')) {
                    prevLink = `${prevPageBaseURL}&${pageParam}`;
                } else {
                    prevLink = `${prevPageBaseURL}?${pageParam}`;
                }
            }
        } else {
            prevLink = prevPageBaseURL;
        }

        //nextLink

        let nextPageBaseURL = `http://${req.hostname}:${PORT}${req.originalUrl}`;
        let nextLink;
        
        if (result.hasNextPage) {
            const pageParam = `page=${result.nextPage}`;
            if (nextPageBaseURL.includes('page=')) {
                // La URL ya contiene un parámetro "page", reemplaza el valor existente
                nextLink = nextPageBaseURL.replace(/page=\d+/, pageParam);
            } else {
                // Agrega el parámetro "page" a la URL
                if (nextPageBaseURL.includes('?')) {
                    nextLink = `${nextPageBaseURL}&${pageParam}`;
                } else {
                    nextLink = `${nextPageBaseURL}?${pageParam}`;
                }
            }
        } else {
            nextLink = nextPageBaseURL;
        }

        return {
            statuscode: 200,
            response: {
                status: 'succes',
                payload: result.docs,
                totalPages: result.totalPages,
                prevPage: result.prevPage,
                nextPage: result.nextPage,
                page: result.page,
                hasPrevPage: result.hasPrevPage,
                hasNextPage: result.hasNextPage,
                prevLink: result.hasPrevPage ? prevLink : null,
                nextLink: result.hasNextPage ? nextLink : null,
            }
        }


    }catch(err){
        console.log(err.message)
    }
}