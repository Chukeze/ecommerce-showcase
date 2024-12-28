import { hash, compare } from 'bcrypt'
import pkg from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import {
  Customers,
  UserTokens,
  Employees,
  Memberships,
} from '../models/userModel.js'
import { userEvents, userWebSocket } from '../modules/users.js'

const { sign } = pkg

export async function registerCustomer(req, res) {
  try {
    console.log('Incoming Request Url: ', req.url)
    console.log('Incoming Request Body:', req.body)

    const { username, password, email } = req.body
    const hashedPassword = await hash(password, 10)
    const user = await Customers.create({
      id: uuidv4(),
      username,
      password: hashedPassword,
      email,
    })
    const membership = await Memberships.findOne({ where: { name: 'bronze' } })
    if (membership) {
      await user.setMembership(membership)
    } else {
      throw new Error('Membership type does not exist')
    }

    const token = sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' })
    await UserTokens.create({
      token,
      customerId: user.id,
      duration: 3600,
      stillValid: true,
    })
    const customerWithToken = await Customers.findOne({
      where: { id: user.id },
      include: [
        { model: UserTokens, attributes: ['token'], as: 'token' },
        { model: Memberships, attributes: ['name'], as: 'membership' },
      ],
    })

    console.log('customer with token:', customerWithToken)

    const createdUser = {
      id: customerWithToken.id,
      username: customerWithToken.username,
      email: customerWithToken.email,
      //membership: customerWithToken.memberships?.name,
      //token: customerWithToken.UserTokens?.token,
      membership: customerWithToken.membership
        ? customerWithToken.membership.name
        : 'failed to find membership',
      token: customerWithToken.UserTokens
        ? customerWithToken.UserTokens.token
        : 'failed to find token',
    }

    if (userWebSocket && userWebSocket.clients) {
      console.log('i made it here in user service')
      userWebSocket.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: 'UserCreated', createdUser }))
        }
      })
    } else {
      userEvents.emit('UserCreated', { id: user.id })
    }
    console.log('i skip user created event in user service')

    res
      .status(201)
      .json({ message: 'Customer registered successfully', createdUser })
  } catch (error) {
    console.error('Error registering customer:', error)
    res.status(500).json({ message: `Registration failed: ${error.message}` })
  }
}

export async function loginCustomer(req, res) {
  try {
    const { email, password } = req.body
    const user = await Customers.findOne({ where: { email } })
    if (!user) {
      return res.status(400).send('Customer not found')
    }
    if (user && (await compare(password, user.password))) {
      const token = sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      )
      userEvents.emit('UserValid', { token })
      res.json({ message: 'Login successful', token })
    } else {
      res.status(400).send('Invalid credentials')
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

//
export async function deleteCustomer(req, res) {
  try {
    const user = await Customers.findById({ where: { id: req.user.id } }).then(
      (user) => {
        user.destroy()
      }
    )
    userEvents.emit('UserDeleted', { id: req.user.id })
    res.json({ message: 'Customer deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function loginEmployee(req, res) {
  try {
    const { email, password, role } = req.body
    const user = await Employees.findOne({ where: { email } })
    if (!user) {
      return res.status(400).send('Employee not found')
    }
    if (!user.role === role) {
      return res.status(401).send('Unauthorized')
    }
    if (user && (await compare(password, user.password))) {
      const token = sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      )
      userEvents.emit('UserValid', { token })
      res.json({ message: 'Login successful', token })
    } else {
      res.status(400).send('Invalid credentials')
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
