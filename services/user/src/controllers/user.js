import { hash, compare } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'
import { Customer} from '../models/userModel'


export async function registerCustomer(req, res) {
  try {
    const { username, password, email } = req.body
    const hashedPassword = await hash(password, 10)
    const user = await Customer.create({
      id: uuidv4(),
      username,
      password: hashedPassword,
      email,
    })
    res.status(201).json({ message: 'Customer registered successfully', user })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export async function loginCustomer(req, res) {
  try {
    const { email, password } = req.body
    const user = await Customer.findOne({ where: { email } })
    if (!user) {
      return res.status(400).send('Customer not found')
    }
    if (user && (await compare(password, user.password))) {
      const token = sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      )
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
    const user = await Customer.findById({ where: { id: req.user.id } }).then((user) => { user.destroy() });
    res.json({ message: 'Customer deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}