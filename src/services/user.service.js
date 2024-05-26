const { User, sequelize } = require('../models')
const bcrypt = require('bcrypt')
const validate = require('../validations/validate')
const userValidation = require('../validations/user.validation')
const ResponseError = require('../responses/error.response')
const { Op } = require('sequelize')
const jwt = require('jsonwebtoken')

exports.register = async (request) => {
    const registerRequest = validate(userValidation.registerValidation, request)

    const existingUser = await User.count({
        where: {
            [Op.or]: [{
                username: registerRequest.username
            }, {
                email: registerRequest.email
            }]
        }
    })

    if (existingUser) throw new ResponseError(409, 'username or email already in use')

    registerRequest.password = bcrypt.hashSync(registerRequest.password, 10)

    return User.create(registerRequest)
}

exports.login = async (request) => {
    const t = await sequelize.transaction()
    try {
        if (request.authHeader === undefined) throw new ResponseError(400, 'invalid request')

        const authHeaders = request.authHeader?.split(' ')

        if (authHeaders[0] !== 'Basic') throw new ResponseError(400, 'invalid request')

        const authData = Buffer.from(authHeaders[1], 'base64').toString('ascii').split(':')

        const loginRequest = validate(userValidation.loginValidation, {
            username: authData[0],
            password: authData[1]
        })

        const user = await User.findOne({
            where: {
                username: loginRequest.username
            }
        }, { transaction: t })

        if (!user) throw new ResponseError(404, 'user was not found')

        const isValidPassword = bcrypt.compareSync(loginRequest.password, user.password)

        if (!isValidPassword) throw new ResponseError(400, 'username or password wrong')

        const token = jwt.sign({ username: user.username }, 'FAISALGANTENG', { expiresIn: 60 * 60 })

        await User.update({
            token
        }, {
            where: {
                username: user.username
            }
        }, { transaction: t })

        await t.commit()

        return {
            token
        }
    } catch (error) {
        await t.rollback()
        throw error
    }
}

exports.logout = async (request) => {
    const t = await sequelize.transaction()
    try {
        const logoutRequest = validate(userValidation.logoutValidation, request)

        const user = await User.findOne({
            where: {
                username: logoutRequest.username,
                token: logoutRequest.token
            }
        }, { transaction: t })

        if (!user) throw new ResponseError(404, 'login session was not found')

        const logout = await User.update({
            token: null
        }, {
            where: {
                username: logoutRequest.username
            }
        }, { transaction: t })

        await t.commit()

        return logout
    } catch (error) {
        await t.rollback()
        throw error
    }
}

exports.changePassword = async (request) => {
    const t = await sequelize.transaction()
    try {
        const changePasswordRequest = validate(userValidation.changePasswordValidation, { username: request.username, old_password: request.old_password, new_password: request.new_password })

        if (changePasswordRequest.username !== request.requestBy) throw new ResponseError(401, 'unauthorized')

        if (changePasswordRequest.old_password === changePasswordRequest.new_password) throw new ResponseError(400, 'new password must be different with old password')

        const user = await User.findOne({
            where: {
                username: changePasswordRequest.username
            }
        }, { transaction: t })

        const isValidOldPassword = bcrypt.compareSync(changePasswordRequest.old_password, user.password)

        if (!isValidOldPassword) throw new ResponseError(400, 'old password is wrong')

        const password = bcrypt.hashSync(changePasswordRequest.new_password, 10)

        const changePassword = await User.update({
            password
        }, {
            where: {
                username: changePasswordRequest.username
            }
        }, { transaction: t })

        await t.commit()

        return changePassword
    } catch (error) {
        await t.rollback()
        throw error
    }
}