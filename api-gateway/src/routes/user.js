import { Router } from "express";
import { authenticateToken } from "../middlewares/authentication";
import axios from 'axios'
import hystrix from 'hystrixjs'

const userRouter = Router();
const CommandFactory = hystrix.commandFactory


const getUserAccountCommand = CommandFactory.getOrCreate("getUserAccount")
    .run(async (url, headers) => {
        return await axios.get(url, { headers });
    })
    .fallbackTo(() => {
        return { status: 500, data: { message: "User Service is temporarily unavailable. Please Try again later" } };
    })
    .timeout(1000)
    .build();

userRouter.get('/user', authenticateToken, async (req, res) => {
    try{
        const response = await getUserAccountCommand.execute(`${process.env.USER_SERVICE_URL}`, {
            Authorization: req.headers['authorization']
        });
        res.status(response.status).json(response.data);
    }catch(err){
        res.status(err.response?.status || 500).json({message: err.message});
    }
});

export default userRouter;
