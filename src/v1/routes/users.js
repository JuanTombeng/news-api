const express = require('express')
const route = express.Router()
const userController = require('../controller/users')
const validator = require('../middleware/validator')
const authenticator = require('../middleware/authenticator')

route.post('/signup', userController.signup)
route.post('/email-verification/:token', authenticator.emailTokenVerification)
route.post('/login', userController.login)
route.post('/reset-password-form', userController.resetPasswordForm)
route.post('/reset-password-verification', validator.resetPasswordValidation, authenticator.resetPasswordEmailTokenVerification, userController.resetUserPassword)
route.get('/details', authenticator.userTokenVerification, userController.userDetails)

module.exports = route