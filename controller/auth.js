const User = require('../models/user')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnAuthenticatedError } = require('../errors')

const register = async (req, res) => {
   const user = await User.create({ ...req.body })
   const token = user.createJWT()
   res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
   const { email, password } = req.body
   // check if the user sent empty cridentials
   if (!email || !password) {
      throw new BadRequestError('Please provide email and password')
   }
   const user = await User.findOne({ email })
   // check if user with email exist
   if (!user) {
      console.log('error from here');
      throw new UnAuthenticatedError('Invalid cridentials')
   }
   //   check password
   const isPasswordMatched = await user.checkPassword(password)
   if (!isPasswordMatched) {
      throw new UnAuthenticatedError('Invalid cridentials')
   }
   const token = user.createJWT()
   res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}
module.exports = {
   register,
   login
}