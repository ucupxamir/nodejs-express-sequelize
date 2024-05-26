const router = require('express').Router()
const userService = require('../services/user.service')

exports.register = async (req, res, next) => {
    try {
        const data = await userService.register(req.body)

        res.status(200).send({
            status: 'success',
            message: 'berhasil registrasi user',
            data
        })
    } catch (error) {
        next(error)
    }
}

exports.login = async (req, res, next) => {
    try {
        const data = await userService.login({ authHeader: req.get('Authorization') })

        res.status(200).send({
            status: 'success',
            message: 'berhasil login',
            data
        })
    } catch (error) {
        next(error)
    }
}

exports.logout = async (req, res, next) => {
    try {
        const token = req.get('Token')

        const data = await userService.logout({ username: res.locals.user, token })

        res.status(200).send({
            status: 'success',
            message: 'berhasil logout',
            data
        })
    } catch (error) {
        next(error)
    }
}

exports.changePassword = async (req, res, next) => {
    try {
        const data = await userService.changePassword({...req.body, requestBy: res.locals.user })

        res.status(200).send({
            status: 'success',
            message: 'berhasil mengganti password',
            data
        })
    } catch (error) {
        next(error)
    }
}