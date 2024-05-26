const jwt = require('jsonwebtoken')

exports.SelfAuthorization = async (req, res, next) => {
    try {
        next()
    } catch (error) {
        next(error)
    }
}