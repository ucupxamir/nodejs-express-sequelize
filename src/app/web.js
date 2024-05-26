const express = require('express')
const bodyParser = require('body-parser')
const errorMiddleware = require('../middleware/error.middleware')
const api = require('../routers')

const web = express()

web.use(bodyParser.json())
web.use(bodyParser.urlencoded({ extended: false }))
web.use('/api', api)

web.use(errorMiddleware)

module.exports = web