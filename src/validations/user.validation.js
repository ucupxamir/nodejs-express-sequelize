const Joi = require('joi')

exports.registerValidation = Joi.object({
    username: Joi.string().min(8).alphanum().required(),
    password: Joi.string().min(8).alphanum().required(),
    email: Joi.string().email().required(),
    phone: Joi.string(),
    address: Joi.string()
})

exports.loginValidation = Joi.object({
    username: Joi.string().min(8).alphanum().required(),
    password: Joi.string().min(8).alphanum().required()
})

exports.logoutValidation = Joi.object({
    username: Joi.string().min(8).alphanum().required(),
    token: Joi.string().required()
})

exports.changePasswordValidation = Joi.object({
    username: Joi.string().min(8).alphanum().required(),
    old_password: Joi.string().min(8).alphanum().required(),
    new_password: Joi.string().min(8).alphanum().required()
})