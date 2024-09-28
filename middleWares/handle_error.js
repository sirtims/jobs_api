const { StatusCodes } = require('http-status-codes')

const handleErrorMiddleWare = (err, req, res, next) => {
   let customError = {
      statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
      msg: err.message || 'Something went wrong'
   }
   if (err.name === 'CastError') {
      customError.msg = `No item found with id: ${err.value}`
      customError.statusCode = StatusCodes.NOT_FOUND
   }
   if (err.name === 'ValidationError') {
      customError.msg = Object.values(err.errors).map(error => error.message).join(',')
      customError.statusCode = StatusCodes.BAD_REQUEST
   }
   if (err.code && err.code === 11000) {
      customError.msg = `email ${err.keyValue.email} already exist`
      customError.statusCode = StatusCodes.BAD_REQUEST
   }

   res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = handleErrorMiddleWare