import { Router } from 'express'
import { authenticateToken } from '../middlewares/authentication.js'
import axios from 'axios'
import hystrix from 'hystrixjs'
import { header } from 'express-validator'

const userRouter = Router()
const CommandFactory = hystrix.commandFactory

const getUserAccountCommand = CommandFactory.getOrCreate('UserAccount')
  .run(async (url, headers) => {
    console.log('Forwarding request to:', url)
    console.log('Request Body:', body)
    return await axios.get(url, { headers })
  })
  .fallbackTo(() => {
    return Promise.resolve({
      status: 500,
      data: {
        message:
          'User Service is temporarily unavailable. Please Try again later',
      },
    })
  })
  .timeout(1000)
  .build()

const registerUserCommand = CommandFactory.getOrCreate('RegisterUser')
  .run(async (url, body, headers) => {
    console.log('Forwarding request to:', url)
    console.log('Request Body:', body)
    return await axios.post(url, body, { headers })
  })
  .fallbackTo(() => {
    return Promise.resolve({
      status: 500,
      data: {
        message:
          'User Service is temporarily unavailable. Please Try again later',
      },
    })
  })
  .timeout(20000)
  .build()

userRouter.get('/user', authenticateToken, async (req, res) => {
  try {
    const response = await getUserAccountCommand.execute(
      `${process.env.USER_SERVICE_URL}`,
      {
        Authorization: req.headers['authorization'],
      }
    )
    res.status(response.status).json(response.data)
  } catch (err) {
    res.status(err.response?.status || 500).json({ message: err.message })
  }
})

userRouter.post(
  '/user',
  [
    // Validate the request headers or body as needed (optional)
    header('Content-Type')
      .exists()
      .withMessage('Content-Type header must be set to application/json'),
  ],
  async (req, res) => {
    try {
      const response = await registerUserCommand.execute(
        `${process.env.USER_SERVICE_URL}/register`,
        req.body,
        {
          'Content-Type': 'application/json',
        }
      )
      res.status(response.status).json(response.data)
    } catch (err) {
      console.error('Error in POST /user: ', err.message)
      res.status(err.response?.status || 500).json({ message: err.message })
    }
  }
)

export default userRouter
