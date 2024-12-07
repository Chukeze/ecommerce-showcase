import { Router } from 'express'
import axios from 'axios'
import hystrix from 'hystrixjs'

const productRouter = Router()
const CommandFactory = hystrix.commandFactory

const getProductCommand = CommandFactory.getOrCreate("getProduct")
    .run(async (url, headers) => {
        return await axios.get(url, { headers });
    })
    .fallbackTo(() => {
        return { status: 500, data: { message: "Product Service is temporarily unavailable. Please Try again later" } };
    })
    .timeout(1000)
    .build();

productRouter.get('/product', async (req, res) => {
    try{
        const response = await getProductCommand.execute(`${process.env.PRODUCT_SERVICE_URL}/product`, {
            Authorization: req.headers['authorization']
        });
        res.status(response.status).json(response.data);
    }catch(err){
        res.status(err.response?.status || 500).json({message: err.message});
    }
});
export default productRouter;
