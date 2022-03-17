const express = require('express')
const route = express.Router()

const userRouter = require('./users')

route.use('/users/', userRouter)

module.exports = route