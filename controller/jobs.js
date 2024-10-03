const Job = require('../models/job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')



const getAllJobs = async (req, res) => {
   const { company, jobType, status, sort } = req.query
   const { userId } = req.user
   let queryObject = { createdBy: userId }
   if (company) {
      queryObject.company = { $regex: company, $options: 'i' }
   }
   if (jobType) {
      queryObject.jobType = jobType
   }
   if (status) {
      queryObject.status = status
   }

   let result = Job.find(queryObject)
   if (sort) {
      const sortedBy = sort.split(',').join(' ')
      result = result.sort(sortedBy)
   }
   else {
      result = result.sort('createdAt')
   }
   const jobs = await result
   res.status(StatusCodes.OK).json({ count: jobs.length, jobs })
}
const getJob = async (req, res) => {
   const { id: jobId } = req.params
   const { userId } = req.user

   const job = await Job.findOne({ _id: jobId, createdBy: userId })
   if (!job) {
      throw new NotFoundError(`No job with id:${jobId}`)
   }
   res.status(StatusCodes.OK).json({ job })
}
const createJob = async (req, res) => {
   const { userId } = req.user
   const { company, position } = req.body
   req.body.createdBy = userId
   if (!company || !position) {
      throw new BadRequestError('company and position fields must not be empty')
   }
   const job = await Job.create({ ...req.body })
   res.status(StatusCodes.CREATED).json({ job })
}
const updateJob = async (req, res) => {
   const { id: jobId } = req.params
   const { userId } = req.user
   const { company, position, status } = req.body

   if (!company || !position || !status) {
      throw new BadRequestError('All fields must not be empty')
   }
   const job = await Job.findOneAndUpdate(
      { _id: jobId, createdBy: userId },
      req.body,
      { new: true, runValidators: true }
   )

   if (!job) {
      throw new NotFoundError(`No job with id:${jobI}`)
   }
   res.status(StatusCodes.OK).json({ job })
}
const deleteJob = async (req, res) => {
   const { id: jobId } = req.params
   const { userId } = req.user


   const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId })
   if (!job) {
      throw new NotFoundError(`No job with id:${jobId}`)
   }
   res.status(StatusCodes.OK).send()
}

module.exports = {
   getAllJobs,
   getJob,
   createJob,
   updateJob,
   deleteJob
}