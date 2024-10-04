const mongoose = require('mongoose')

const JobSchema = mongoose.Schema({
   company: {
      type: String,
      required: [true, 'please provide a company name'],
      maxLength: [15, 'Length not more than 15 characters']
   },
   position: {
      type: String,
      required: [true, 'please provide position'],
      maxLength: [50, 'Length not more than 50 characters']
   },
   status: {
      type: String,
      enum: ['pending', 'interview', 'declined'],
      default: 'pending'
   },
   createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'please provide a user'],
   },
   jobType: {
      type: String,
      enum: ['full-time', 'per-time', 'remote', 'intern'],
      default: 'full-time'
   },
   location: {
      type: String,
      required: [true, 'please provide location'],
      minLength: [3, "must not be less than 3 characters"]
   }
}, { timestamps: true })

module.exports = mongoose.model('Job', JobSchema)