import cors from 'cors'
import express from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

dotenv.config()

export const securityLayer = (app) => {
  const corsOptions = {
    origin: process.env.ALLOWED_ORIGINS.split(',').map((origin) =>
      origin.trim()
    ),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200,
  }

  //console.log('Allowed origins: ', corsOptions.origin)

  app.use(cors(corsOptions))
  app.options('*', cors()) // Automatically handle OPTIONS requests
  app.use(helmet())

  const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: 'Too many requests, please try again later.',
  })
  app.use(limiter)

  app.use(express.json())
}
