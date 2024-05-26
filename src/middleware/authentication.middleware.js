const jwt = require('jsonwebtoken')
const { User } = require('../models')

exports.Authentication = async (req, res, next) => {
    try {
        const token = req.get('Token')

        if (!token) {
            res.status(401).send({ errors: ['unauthorized']}).end()
        } else {
            const decode = jwt.verify(token, 'FAISALGANTENG')

            const user = await User.findOne({
                where: {
                    username: decode.username
                }
            })

            if (!user) {
                res.status(401).send({ errors: ['unauthorized']}).end()
            } else {

                if (user.token !== token) {
                    res.status(401).send({ errors: ['unauthorized']}).end()
                } else {
                    res.locals.user = decode.username

                    next()
                }
            }
        }
    } catch (error) {
        next(error)
    }
}