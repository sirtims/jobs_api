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
      throw new UnAuthenticatedError(`Invalid cridentials: No User with email ${email}`)
   }
   //   check password
   const isPasswordMatched = await user.checkPassword(password)
   if (!isPasswordMatched) {
      throw new UnAuthenticatedError('Invalid cridentials: incorrect password')
   }
   const token = user.createJWT()
   res.status(StatusCodes.OK).json({ user: { name: user.name, id: user._id }, token })
}

const getUser = async (req, res) => {
   const { userId } = req.user
   const user = await User.findOne({ _id: userId }).select('name email number location')
   res.status(200).json({ user })
}


const updateUserInfo = async (req, res) => {
   const { userId } = req.user
   const { name, location, number } = req.body
   if (!name || !location || !number) {
      throw new BadRequestError('name, location and number field must be filled')
   }
   const user = await User.findOneAndUpdate({ _id: userId }, req.body, { new: true, runValidators: true })
   if (!user) {
      throw new NotFoundError(`No job with id:${userId}`)
   }
   res.status(200).json({ user })
}
module.exports = {
   register,
   login,
   getUser,
   updateUserInfo
}