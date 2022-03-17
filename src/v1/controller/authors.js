const bcrypt = require('bcrypt')
const { v4 : uuidv4 } = require('uuid')
const {response, generateToken, sendEmailVerification, sendEmailResetPassword} = require('../helper/common')
const userQuery = require('../models/users')
const authorQuery = require('../models/authors')

const userToAuthor = async (req, res, next) => {
    try {
        const {email, active, role} = req.decoded
        if (active === 1 && role === 'member') {
            const [user] = await userQuery.getUserId(email)
            const idAuthor = uuidv4()
            const authorData = {
                id : idAuthor,
                id_users : user.id
            }
            const newAuthor = await authorQuery.userToAuthor(authorData)
            if (newAuthor.affectedRows > 0) {
                const pendingAuthor = await authorQuery.getAuthorDetail(user.id)
                response(res, 'Success', 200, pendingAuthor, 'Thank your for applying as a new Author. Our administration will shortly approve your request.')
            }
        } else {
            response(res, 'Failed', 400, null, `Your account is not yet activated.`)
        }
    } catch (error) {
        next({ status: 500, message: `${error.message}`})
    }
}

module.exports = {
    userToAuthor
}