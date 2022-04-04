const bcrypt = require('bcrypt')
const { v4 : uuidv4 } = require('uuid')
const {response, generateToken, sendEmailVerification, sendEmailResetPassword} = require('../helper/common')
const userQuery = require('../models/users')

const signup = async (req, res, next) => {
    try {
        const {email, password, phone_number} = req.body
        const [findUser] = await userQuery.findUser(email)
        if (findUser.length === null) {
            const salt = await bcrypt.genSalt()
            const userId = uuidv4()
            const hashedPassword = await bcrypt.hash(password, salt)
            const userData = {
                id : userId,
                email : email,
                password : hashedPassword,
                phone_number : phone_number
            }
            const newUser = await userQuery.signup(userData)
            if (newUser.affectedRows > 0) {
                const result = newUser
                const payload = {
                    email : email,
                    phone_number : phone_number
                }
                const token = generateToken(payload)
                result.token = token
                sendEmailVerification(email, token)
                response(res, 'Success', 200, result, 'Please check your email, a verification email has been send to verfity your email')
            }
        } else {
            response(res, 'Failed', 400, null, `Please select another email to signup.`)
        }
    } catch (error) {
        next({ status: 500, message: `${error.message}`})
    }
}

const login = async (req, res, next) => {
    try {
        const {email, password} = req.body
        const [user] = await userQuery.findUser(email)
        if (user.length === null) {
            response(res, 'Failed', '403', null, `We cannot find your email, please login with another account`)
        } else if (user.email === email) {
            if (user.active === 1) {
                const checkPassword = await bcrypt.compare(password, user.password)
                if(checkPassword) {
                    const payload = {
                        email : user.email,
                        active : user.active,
                        role : user.role_name
                    }
                    const token = generateToken(payload)
                    user.token = token
                    response(res, 'Success', 200, user, 'Login is successful, Welcome back!')
                } else {
                    response(res, 'Failed', 400, null, 'Your password is incorrect! Please try again.')
                }
            } else {
                response(res, 'Failed', 400, null, `Your account is not yet activated.`)
            }
        }
    } catch (error) {
        console.log(error)
        next({ status: 500, message: `${error.message}`})
    }
}

const resetPasswordForm = async (req, res, next) => {
    try {
        const {email} = req.body
        const [user] = await userQuery.findUser(email)
        if (user.length !== null) {
            if (user.active === 1) {
                const payload = {
                    email : email
                }
                const token = generateToken(payload)
                sendEmailResetPassword(email, token)
                response(res, 'Success', 200, 'Please check your email, a verification email has been send to verfity your email first.')
            } else {
                response(res, 'Failed', 400, null, `Your account is not yet activated.`)
            }
        } else {
            response(res, 'Failed', 400, null, 'We cannot find your email, please sign up first to our application.')
        }
    } catch (error) {
        next({ status: 500, message: `${error.message}`})
    }
}

const resetUserPassword = async (req, res, next) => {
    try {
        const {email} = req.decoded
        const {password} = req.body
        const salt = await bcrypt.genSalt()
        const [user] = await userQuery.getUserId(email)
        const hashedPassword = await bcrypt.hash(password, salt)
        const result = await userQuery.resetUserPassword(hashedPassword, email, user.id)
        response(res, 'Success', 200, result, `User ${email} reset password is completed`)
        res.redirect(`${process.env.FRONT_END_URL}/auth/login`)
    } catch (error) {
        next({ status: 500, message: `${error.message}`})
    }
}

const userDetails = async (req, res, next) => {
    try {
        const {email, active, role} = req.decoded
        console.log(email, active, role)
        if (active === 1 && role === 'member') {
            const [user] = await userQuery.getUserId(email)
            const [result] = await userQuery.getUserDetails(user.id)
            response(res, 'Success', 200, result, `User ${email} details`)
        }
    } catch (error) {
        console.log(error)
        next({ status: 500, message: `${error.message}`})
    }
}

module.exports = {
    signup,
    login,
    resetPasswordForm,
    resetUserPassword,
    userDetails
}