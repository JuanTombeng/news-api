const Joi = require('joi')
const {response} = require('../helper/common')

const resetPasswordValidation = (req, res, next) => {
    const {password, confirmPassword} = req.body
    const validateData = Joi.object({
        password : Joi.string().min(8).max(16).alphanum().required(),
        confirmPassword : Joi.string().min(8).max(16).alphanum().required(),
    })
    const {error} = validateData.validate({
        password : password,
        confirmPassword : confirmPassword
    })
    if (error) {
        const errorMessage = error.details[0].message
        return response(res, 'Failed', 400, null, errorMessage)
    } else {
        if (password !== confirmPassword) {
            return response(res, 'Failed', 400, null, 'Password and Confirm Password is not match')
        } 
        next()
    }

}

module.exports = {
    resetPasswordValidation
}