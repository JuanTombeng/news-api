const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const response = (res, title, status, result, message, error, pagination) => {
    res.status(status).json({
        title : title,
        status : status || 200,
        data : result,
        message : message,
        error : error || null,
        pagination : pagination || null
    })
}

const handleURLNotFound = (req, res, next) => {
    res.status(404)
    res.json({
        message : `URL NOT FOUND`
    })
}

const errorHandling = (err, res) => {
    const statusCode = err.status
    const message = err.status
    response(res, null, statusCode, message)
}

const generateToken = (payload) => {
    const secretKey = process.env.SECRET_KEY
    const verifyOptions = {
        expiresIn : 60 * 60,
        issuer : 'morning_brew'
    }
    const result = jwt.sign(payload, secretKey, verifyOptions)
    return result
}

const sendEmailVerification = async (email, token) => {
    const transporter = nodemailer.createTransport({
        host : `smtp.gmail.com`,
        port : 465,
        secure : true,
        auth : {
            user : process.env.ADMIN_EMAIL_ACCOUNT,
            pass : process.env.ADMIN_EMAIL_PASSWORD
        }
    })
    const info = await transporter.sendMail({
        from : process.env.ADMIN_EMAIL_ACCOUNT,
        to: email,
        subject : `Morning Brew User Sign Up Verification`,
        html : 
        `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css">
            <title>Document</title>
        </head>
        <body>
            <h3 class="title">
                Welcome to Morning Brew!
            </h3>
            <hr />
            <div class="parag">
                Thank you for signin up with us! To continue the signin process, please click the link provided below to verify you account!
            </div>
            <div class="confirm">
                <a href=${API_URL}/v1/users/email-verification/${token} target="_blank">Click Here</a>
            </div>
        </body>
        </html>
        `
    })
    console.log(info);
}

const sendEmailResetPassword = async (email, token) => {
    const transporter = nodemailer.createTransport({
        host : `smtp.gmail.com`,
        port : 465,
        secure : true,
        auth : {
            user : process.env.ADMIN_EMAIL_ACCOUNT,
            pass : process.env.ADMIN_EMAIL_PASSWORD
        }
    })
    const info = await transporter.sendMail({
        from : process.env.ADMIN_EMAIL_ACCOUNT,
        to: email,
        subject : `Morning Brew User Sign Up Verification`,
        html : 
        `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" type="text/css">
            <title>Document</title>
        </head>
        <body>
            <h3 class="title">
                Morning Brew - Reset Password
            </h3>
            <hr />
            <div class="parag">
                Please do NOT share this email to other people! To continue the signin process, please click the link provided below to verify you account!
            </div>
            <div class="confirm">
                <a href=${FRONT_END_URL}/reset-password/${token} target="_blank">Click Here</a>
            </div>
        </body>
        </html>
        `
    })
    console.log(info);
}


module.exports ={
    response,
    handleURLNotFound,
    errorHandling,
    generateToken,
    sendEmailVerification,
    sendEmailResetPassword
}