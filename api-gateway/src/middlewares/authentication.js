import jwt from 'jsonwebtoken'

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  //console.log('headers: ', authHeader)
  const token = authHeader && authHeader.split(' ')[1]
  //console.log('token: ', token)
  if (token == null || !token)
    return res.status(401).json({ message: 'Token is missing' })

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    //console.log('secret is : ', process.env.JWT_SECRET)
    //console.log('error is: ', err)
    if (err) return res.status(403).json({ message: 'Token is invalid' })

    req.user = user

    next()
  })
}
