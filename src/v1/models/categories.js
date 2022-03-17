const connection = require('../config/dbConfig')

const getCategories = ({search, order, sort, lastAdded, lastModified}) => {
    return new Promise ((resolve, reject) => {
        let sql = `SELECT * FROM categories `
        if (search) {
            if (order && sort) {
                sql += `WHERE categories.category_name LIKE '%${search}%' ORDER BY categories.${order} ${sort} `
            } else if (lastAdded) {
                sql += `WHERE categories.category_name LIKE '%${search}%' ORDER BY categories.created_at DESC`
            } else if(lastModified) {
                sql += `WHERE categories.category_name LIKE '%${search}%' ORDER BY categories.updated_at DESC`
            }
        } else {
            if (order && sort) {
                sql += `ORDER BY categories.${order} ${sort} `
            } else if (lastAdded) {
                sql += `ORDER BY categories.created_at DESC`
            } else if(lastModified) {
                sql += `ORDER BY categories.updated_at DESC`
            }
        }
        connection.query(sql, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

module.exports = {
    getCategories
}