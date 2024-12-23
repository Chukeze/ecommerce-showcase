import express from 'express'
import dotenv from 'dotenv'
import { securityLayer } from './middlewares/security.js'
import userRouter from './routes/user.js'
import productRouter from './routes/product.js'
import orderRouter from './routes/order.js'
import logger from './utils/logger.js'
import {
  validateProductRequest,
  validatePurchaseRequest,
  validateSignUpOrSignInRequest,
} from './middlewares/validation.js'
import { errorHandler } from './middlewares/errorHandler.js'

dotenv.config()
const app = express()

securityLayer(app)

app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`)
  next()
})

app.use(errorHandler)

app.use('/api/user', validateSignUpOrSignInRequest, userRouter)
app.use((req, res, next) => {
  console.log(`Forwarded request to: ${req.method} ${req.url}`)
  next()
})

app.use('/api/product', validateProductRequest, productRouter)
app.use('/api/orders', validatePurchaseRequest, orderRouter)
app.use((req, res, next) => {
  logger.info(`Response sent: ${res.statusCode}`)
  next()
})
const port = process.env.PORT || 3100
app.listen(port, () => {
  //console.log(`API Gateway listening on port ${port}`)
  logger.info(`API Gateway listening on port ${port}`)
})
