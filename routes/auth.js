const express = require('express')
const router = express.Router()
const authenticateMiddleware = require('../middleWares/authentication')
const { login, register, getUser, updateUserInfo } = require('../controller/auth')
router.post('/login', login)
router.post('/register', register)
router.get('/user/:id', authenticateMiddleware, getUser)
router.patch('/user/:id', authenticateMiddleware, updateUserInfo)

module.exports = router 