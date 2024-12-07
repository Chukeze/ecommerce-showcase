import { Router } from 'express'
import axios from 'axios'
import hystrix from 'hystrixjs'

const orderRouter = Router()
const CommandFactory = hystrix.commandFactory

const getOrderCommand = CommandFactory.getOrCreate("getOrder")
    .run(async (url, headers) => {
        return await axios.get(url, { headers });
    })
    .fallbackTo(() => {
        return { status: 500, data: { message: "Order Service is temporarily unavailable. Please Try again later" } };
    })
    .timeout(1000)
    .build();

orderRouter.get('/order', async (req, res) => { 
    try{
        const response = await getOrderCommand.execute(`${process.env.ORDER_SERVICE_URL}/order`, {
            Authorization: req.headers['authorization']
        });
        res.status(response.status).json(response.data);
    }catch(err){
        res.status(err.response?.status || 500).json({message: err.message});
    }
});
