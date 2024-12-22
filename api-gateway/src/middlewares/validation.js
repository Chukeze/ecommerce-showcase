import { body, validationResult } from 'express-validator'
import logger from '../utils/logger.js'

export const validateRequest = [
  body('email').isEmail().withMessage('Valid Email is required'),
  body('password')
    .isLength({ min: 10 })
    .withMessage('Password must be at least 10 characters long'),
  body('username')
    .isLength({ min: 2 })
    .withMessage('Username must be at least 2 characters long'),
  (req, res, next) => {
    const errors = validationResult(req)
    //console.log(errors);
    if (errors.isEmpty()) {
      return next()
    }
    logger.error('Validation Error: ', errors.array())
    return res.status(400).json({ errors: errors.array() })
  },
]
