import express, { json } from 'express'
import router from './routes/userRoute.js'
import port from './server.js'
import dotenv from 'dotenv'
//import AWS from 'aws-sdk'

dotenv.config()

const app = express()
//const cloudmap = new AWS.ServiceDiscovery({ region: 'us-east-1' })

app.use(json())
app.use('/user', router)
app.listen(port, () => {
  console.log(`User Service listening on port ${port}`)
})
/*
app.listen(port, async () => {
    console.log(`User Service listening on port ${port}`);
    try{
        const params = {
            ServiceId: process.env.CLOUDMAP_SERVICE_ID,
            InstanceId: `user-service-${port}`,
            Attributes: {
                AWS_INSTANCE_IPV4: process.env.AWS_INSTANCE_IPV4,
                AWS_INSTANCE_PORT: port
            }
        };
        await cloudmap.registerInstance(params).promise();
        console.log('User service registered with AWS Cloud Map');
    }catch(err){
        console.log('Error registering service with Cloud Map: ', err);
    }
});*/
