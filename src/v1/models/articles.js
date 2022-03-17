const connection = require('../config/dbConfig')

const getArticles = ({category, search, order, sort, lastAdded, lastModified}) => {
    return new Promise ((resolve, reject) => {
        let sql = `SELECT articles.id, articles.title, articles.description, articles.article_picture, articles.total_visits, articles.likes, articles.publishing_status, articles.created_at, articles.updated_at, 
        authors.id_users, categories.category_name FROM articles INNER JOIN authors ON articles.id_authors = authors.id INNER JOIN categories ON articles.id_categories = categories.id `
        if (category) {
            sql += `WHERE categories.category_name = ? `
        }
        if (search) {
            if (order && sort) {
                sql += `AND articles.title LIKE '%${search}%' ORDER BY articles.${order} ${sort} `
            } else if (lastAdded) {
                sql += `AND articles.title LIKE '%${search}%' ORDER BY articles.created_at DESC`
            } else if(lastModified) {
                sql += `AND articles.title LIKE '%${search}%' ORDER BY articles.updated_at DESC`
            }
        } else {
            if (order && sort) {
                sql += `ORDER BY articles.${order} ${sort} `
            } else if (lastAdded) {
                sql += `ORDER BY articles.created_at DESC`
            } else if(lastModified) {
                sql += `ORDER BY articles.updated_at DESC`
            }
        }
        connection.query(sql, category, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const getArticlesLatest = ({dateNow, dateLastWeek}) => {
    return new Promise ((resolve, reject) => {
        let sql = `SELECT articles.id, articles.title, articles.description, articles.article_picture, articles.total_visits, articles.likes, articles.publishing_status, articles.created_at, articles.updated_at, 
        authors.id_users, categories.category_name FROM articles INNER JOIN authors ON articles.id_authors = authors.id INNER JOIN categories ON articles.id_categories = categories.id `
        if (dateNow && dateLastWeek !== null) {
            sql += `WHERE articles.created_at BETWEEN ${dateNow} AND ${dateLastWeek}`
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

const getArticlesView = (id_articles, id_authors) => {
    return new Promise ((resolve, reject) => {
        const sql = `SELECT articles.id, articles.title, articles.description, articles.article_picture, articles.total_visits, articles.likes, articles.publishing_status, articles.created_at, articles.updated_at, 
        authors.id_users, users.fullname, users.job_title, users.profile_picture FROM authors INNER JOIN articles ON authors.id = articles.id_authors INNER JOIN users ON authors.id_users = users.id 
        WHERE articles.id = ? AND authors.id = ?`
        connection.query(sql, [id_articles, id_authors], (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const postNewArticle = (data) => {
    return new Promise ((resolve, reject) => {
        const sql = `INSERT INTO articles SET ?`
        connection.query(sql, data, (error, result) => {
            if (!error) {
                resolve(result)
            } else {
                reject(error)
            }
        })
    })
}

const getPendingArticles = ({order, sort, lastAdded}) => {
    return new Promise ((resolve, reject) => {
        let sql = `SELECT * FROM articles WHERE publishing_status = 'pending' `
        if (order && sort) {
            sql += `ORDER BY articles.${order} ${sort} `
        } else if (lastAdded) {
            sql += `ORDER BY articles.created_at DESC`
        } else if(lastModified) {
            sql += `ORDER BY articles.updated_at DESC`
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
    getArticles,
    getArticlesLatest,
    getArticlesView,
    postNewArticle,
    //admin
    getPendingArticles
}