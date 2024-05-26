const router = require('express').Router()
const userController = require('../../controllers/user.controller')

router.post('/logout', userController.logout)
router.put('/change-password', userController.changePassword)

module.exports = router