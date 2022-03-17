const createError = require('http-errors')
const jwt = require('jsonwebtoken')
const userQuery = require('../models/users')
const {response} = require('../helper/common')

const userTokenVerification = async (req, res, next) => {
    try {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        } else {
            return next(createError(403, 'Server Need Token'))
        }
        const verifyOptions = {
            issuer : 'morning_brew'
        }
        const secretKey = process.env.SECRET_KEY
        const decoded = jwt.verify(token, secretKey, verifyOptions)
        req.decoded = decoded
        next()
    } catch (error) {
        if (error && error.name === `JsonWebTokenError`) {
            return next(createError(400, 'Token Invalid'))
        } else if (error && error.name === 'TokenExpiredError') {
            return next(createError(400, 'Token Expired'))
        } else {
            return next(createError(400, 'Token not activated'))
        }
    }
}

const emailTokenVerification = async (req, res, next) => {
    try {
        const emailToken = req.params.token
        const secretKey = process.env.SECRET_KEY
        const verifyOptions = {
            issuer : 'morning_brew'
        }
        const decoded = jwt.verify(emailToken, secretKey, verifyOptions)
        const username = decoded.username
        const email = decoded.email
        const [user] = await userQuery.getUserId(email)
        const activateUser = await userQuery.updateVerifiedUser(user.id, email)
        res.redirect(`${process.env.FRONT_END_URL}/auth/login`)
        response(res, activateUser, 200, `User with email ${email} is verified`, null)
    } catch (error) {
        if (error && error.name === `JsonWebTokenError`) {
            return next(createError(400, 'Token Invalid'))
        } else if (error && error.name === 'TokenExpiredError') {
            return next(createError(400, 'Token Expired'))
        } else {
            return next(createError(400, 'Token not activated'))
        }
    }
}

const resetPasswordEmailTokenVerification = async (req, res, next) => {
    try {
        let token
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]
        } else {
            return next(createError(403, 'Server Need Token'))
        }
        const verifyOptions = {
            issuer : 'zwallet'
        }
        const secretKey = process.env.SECRET_KEY
        const decoded = jwt.verify(token, secretKey, verifyOptions)
        req.decoded = decoded
        next()
    } catch (error) {
        if (error && error.name === `JsonWebTokenError`) {
            return next(createError(400, 'Token Invalid'))
        } else if (error && error.name === 'TokenExpiredError') {
            return next(createError(400, 'Token Expired'))
        } else {
            return next(createError(400, 'Token not activated'))
        }
    }
}

module.exports = {
    userTokenVerification,
    emailTokenVerification,
    resetPasswordEmailTokenVerification
}