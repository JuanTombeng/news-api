const {response} = require('../helper/common')
const categoryQuery = require('../models/categories')

const getCategories = async (req, res, next) => {
    try {
        const search = req.query.title
        const order = req.query.order
        const sort = req.query.sort
        const lastAdded = req.query.lastAdded
        const lastModified = req.query.lastModified
        const queryData = {
            search : search, 
            order : order, 
            sort : sort, 
            lastAdded : lastAdded, 
            lastModified : lastModified
        }
        const result = await categoryQuery.getCategories(queryData)
        response(res, 'Success', 200, result, 'List of categories')
    } catch (error) {
        next({ status: 500, message: `${error.message}`})
    }
}


module.exports = {
    getCategories
}