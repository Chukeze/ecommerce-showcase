import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null || !token) return res.sendStatus(401)
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      console.log(err)
  
      if (err) return res.sendStatus(403)
  
      req.user = user

      authorizeRole(req.user.role);
  
      next()
    })
  }

  const authorizeRole = (role) => (req, res) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Access Denied' })
    }
  }
