import express from 'express'
import dotenv from 'dotenv'
import { securityLayer } from './middlewares/security.js'
import userRouter from './routes/user.js'
import productRouter from './routes/product.js'
import orderRouter from './routes/order.js'
import logger from './utils/logger.js'
import { validateRequest } from './middlewares/validation.js'
import { errorHandler } from './middlewares/errorHandler.js'

dotenv.config()
const app = express()

securityLayer(app)

app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`)
  logger.info(`Response sent: ${res.statusCode}`)
  next()
})

app.use(errorHandler)

app.use('/api/users', validateRequest, userRouter)
app.use('/api/products', validateRequest, productRouter)
app.use('/api/orders', validateRequest, orderRouter)

const port = process.env.PORT || 3100
app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`)
  logger.info(`API Gateway listening on port ${port}`)
})
