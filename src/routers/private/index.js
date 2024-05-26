const router = require('express').Router()

router.use('/', require('./user.private-router'))

module.exports = router