const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, 'Please provide name'],
      maxLength: [50, 'must not be more than 50 characters'],
      minLength: [2, 'field cannot be lesser thsn 2 characters']
   },
   password: {
      type: String,
      required: [true, 'Please provide a password'],
      minLength: [6, 'password cannot be lesser thsn 6 characters']
   },
   email: {
      type: String,
      required: [true, 'Please provide an email'],
      match: [
         /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Please provide a valid email'
      ],
      unique: true
   },
   number: {
      type: String,
      maxLength: [11, 'must not be more than 11 numbers'],
      minLength: [9, 'must not be less than 9 numbers'],
      required: [true, 'number is require'],
      default: '08000000000'
   },
   location: {
      type: String,
      minLength: [3, 'character for location most not be less than 3'],
      required: [true, 'location is required'],
      default: 'lagos'
   }
})
userSchema.pre('save', async function () {
   const salt = await bcrypt.genSalt(10)
   this.password = await bcrypt.hash(this.password, salt)

})


userSchema.methods.createJWT = function () {
   return jwt.sign(
      { userId: this._id, name: this.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_LIFETIME })
}


userSchema.methods.checkPassword = async function (candidatePassword) {
   return await bcrypt.compare(candidatePassword, this.password)
}
module.exports = mongoose.model('User', userSchema)