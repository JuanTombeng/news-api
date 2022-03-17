const connection = require('../config/dbConfig')

const getAuthorDetail = (id_users) => {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT authors.id, authors.id_users, authors.status, authors.total_posts, authors.total_followers, authors.total_visitors, authors.created_at, authors.updated_at, 
        users.fullname, users.job, users.profile_picture FROM authors INNER JOIN users ON authors.id_users = users.id WHERE authors.id_users = ?`
        connection.query(sql, id_users, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const userToAuthor = (data) => {
    return new Promise ((resolve, reject) => {
        const sql = `INSERT INTO authors SET = ?`
        connection.query(sql, data, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

module.exports = {
    getAuthorDetail,
    userToAuthor
}