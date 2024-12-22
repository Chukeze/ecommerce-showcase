import { Router } from 'express'
import { registerCustomer, loginCustomer } from '../controllers/user.js'
const router = Router()

router.post('/register', registerCustomer)
router.post('/:id', loginCustomer)

export default router
