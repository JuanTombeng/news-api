const express = require('express')
const route = express.Router()

const userRouter = require('./users')
const articleRouter = require('./articles')
const authorRouter = require('./authors')
const categoryRouter = require('./categories')

route.use('/users', userRouter)
route.use('/articles', articleRouter)
route.use('/authors', authorRouter)
route.use('/categories', categoryRouter)

module.exports = route