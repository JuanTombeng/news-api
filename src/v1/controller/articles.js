const { v4 : uuidv4 } = require('uuid')
const {response} = require('../helper/common')
const userQuery = require('../models/users')
const authorQuery = require('../models/authors')
const articleQuery = require('../models/articles')

const getArticles = async (req, res, next) => {
    try {
        const {email, active} = req.decoded
        const category = req.query.category
        const search = req.query.title
        const order = req.query.order
        const sort = req.query.sort
        const lastAdded = req.query.lastAdded
        const lastModified = req.query.lastModified
        const queryData = {
            category : category, 
            search : search, 
            order : order, 
            sort : sort, 
            lastAdded : lastAdded, 
            lastModified : lastModified
        }
        if (active === 1) {
            const articles = await articleQuery.getArticles(queryData)
            response(res, 'Success', 200, articles, 'List of articles')
        }
    } catch (error) {
        next({ status: 500, message: `${error.message}`})
    }
}

const getArticlesHomePage = async (req, res, next) => {
    try {
        const {email, active} = req.decoded
        const dateNow = req.query.dateNow
        const dateLastWeek = req.query.dateLastWeek
        const queryData = {
            dateNow : dateNow,
            dateLastWeek : dateLastWeek
        }
        const result = await articleQuery.getArticlesLatest(queryData)
        response(res, 'Success', 200, result, 'List of articles')
    } catch (error) {
        next({ status: 500, message: `${error.message}`})
    }
}

const getArticlesView = async (req, res, next) => {
    try {
        const {email, active} = req.decoded
        const {id_articles, id_authors} = req.body
        if (active === 1) {
            const articleDetail = await articleQuery.getArticlesView(id_articles, id_authors)
            response(res, 'Success', 200, articleDetail, `Article view of ${id_articles}`)
        }
    } catch (error) {
        next({ status: 500, message: `${error.message}`})
    }
}

const postNewArticle = async (req, res, next) => {
    const {email, active, role} = req.decoded
    const {id_categories, title, description, article_picture} = req.body
    if (active === 1 && role === 'author') {
        const [user] = await userQuery.getUserId(email)
        const [author] = await authorQuery.getAuthorDetail(user.id)
        const idArticle = uuidv4()
        const articleData = {
            id : idArticle,
            id_authors : author.id,
            id_categories : id_categories,
            title : title,
            description : description,
            article_picture : article_picture
        }
        const newArticle = await articleQuery.postNewArticle(articleData)
        if (newArticle.affectedRows > 0) {
            const result = await articleQuery.getArticlesView(idArticle, author.id)
            response(res, 'Success', 200, result, `New article ${title} by ${user.fullname} is created and currently waiting to be publish.`)
        }
    } else {
        response(res, 'Failed', 400, null, `Your account is not yet activated.`)
    }
}

const getPendingArticles = async (req, res, next) => {
    try {
        const {active, role} = req.decoded
        const order = req.query.order
        const sort = req.query.sort
        const lastAdded = req.query.lastAdded
        const queryData = {
            order : order,
            sort : sort,
            lastAdded : lastAdded,
        }
        if (active === 1 && role === 'admin') {
            const result = await articleQuery.getPendingArticles(queryData)
            response(res, 'Success', 200, result, 'List of pending to publish articles')
        } else {
            response(res, 'Failed', 400, null, `You are NOT allow to access this site.`)
        }
    } catch (error) {
        response(res, 'Failed', 400, null, `Your account is not yet activated.`)
    }
}

module.exports = {
    getArticles,
    getArticlesHomePage,
    getArticlesView,
    postNewArticle,
    getPendingArticles
}
