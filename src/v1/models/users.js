const connection = require('../config/dbConfig')

const getUserId = (email) => {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT id FROM users WHERE email = ?`
        connection.query(sql, email, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const findUser = (email) => {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT users.email, users.password, users.active, roles.role_name FROM users INNER JOIN roles ON users.id_roles = roles.id
        WHERE email = ?`
        connection.query(sql, email, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const signup = (data) => {
    return new Promise ((resolve, reject) => {
        const sql = `INSERT INTO users SET ?`
        connection.query(sql, data, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const updateVerifiedUser = (id, email) => {
    return new Promise ((resolve, reject) => {
        const sql = `UPDATE users SET active = 1 WHERE id = ? AND email = ?`
        connection.query(sql, [id, email], (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const resetUserPassword = (password, email, id) => {
    return new Promise ((resolve, reject) => {
        const sql = `UPDATE users SET password = ? WHERE email = ? AND id = ?`
        connection.query(sql, [password, email, id], (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const getUserDetails = (id_user) => {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT users.id, users.email, users.username, users.fullname, users.phone_number, users.job_title, users.job_description, 
        users.profile_picture, users.active, roles.role_name FROM users INNER JOIN roles ON users.id_roles = roles.id WHERE users.id = ?`
        connection.query(sql, id_user, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}


module.exports = {
    getUserId,
    findUser,
    signup,
    updateVerifiedUser,
    resetUserPassword,
    getUserDetails
}