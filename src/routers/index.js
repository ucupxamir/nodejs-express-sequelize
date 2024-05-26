const router = require('express').Router()
const {Authentication} = require('../middleware/authentication.middleware')
const Authorization = require('../middleware/authorization.middleware')

router.use('/', require('./public'))

router.use(Authentication)
router.use(Authorization.SelfAuthorization)

router.use('/', require('./private'))

module.exports = router