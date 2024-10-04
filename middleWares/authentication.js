const { UnAuthenticatedError } = require('../errors')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const authenticateMiddleware = async (req, res, next) => {
   const { authorization } = req.headers
   if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new UnAuthenticatedError('no token provided')
   }
   const token = authorization.split(' ')[1]
   try {
      const payLoad = jwt.verify(token, process.env.JWT_SECRET)
      const { userId, name } = payLoad
      req.user = { userId, name }
      next()
   } catch (error) {
      throw new UnAuthenticatedError('Not authorized')
   }
}

module.exports = authenticateMiddleware