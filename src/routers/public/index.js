const router = require('express').Router()

router.use('/', require('./user.public-router'))

module.exports = router