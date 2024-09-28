const { StatusCodes } = require('http-status-codes')

const Not_Found = (req, res) => res.status(StatusCodes.NOT_FOUND).send('The page you are looking for does not exist')

module.exports = Not_Found