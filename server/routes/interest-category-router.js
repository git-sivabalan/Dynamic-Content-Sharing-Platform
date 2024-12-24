const express = require('express')
const { getCategories } = require('../controller/interest-category-controller');

const interestCategoryRouter = express.Router()

interestCategoryRouter.get('/interestcategories', getCategories);

module.exports = interestCategoryRouter