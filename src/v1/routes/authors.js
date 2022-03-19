const express = require('express')
const route = express.Router()
const authorController = require('../controller/authors')
const authenticator = require('../middleware/authenticator')

route.post('/new', authenticator.userTokenVerification, authorController.userToAuthor)

module.exports = route