const express = require('express')
const route = express.Router()
const categoryController = require('../controller/categories')
const authenticator = require('../middleware/authenticator')

route.get('/', categoryController.getCategories)