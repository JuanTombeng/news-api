const express = require('express')
const route = express.Router()
const articleController = require('../controller/articles')
const authenticator = require('../middleware/authenticator')

route.get('/home', articleController.getArticlesHomePage)
route.get('/', authenticator.userTokenVerification, articleController.getArticles)
route.get('/:id', authenticator.userTokenVerification, articleController.getArticlesView)
route.post('/', authenticator.userTokenVerification, articleController.postNewArticle)
route.get('/waiting-list', authenticator.userTokenVerification, articleController.getPendingArticles)

module.exports = route