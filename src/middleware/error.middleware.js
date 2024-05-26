const { JsonWebTokenError } = require('jsonwebtoken')
const ErrorResponse = require('../responses/error.response')

const errorMiddleware = async (err, req, res, next) => {
  if (!err) {
    next()
    return
  }

  if (err instanceof ErrorResponse) {
    // console.error(err.message)
    res.status(err.status).send({
      errors: err.message.replace(/\"/g, '').split('. ')
    }).end()
  } else if (err instanceof JsonWebTokenError) {
    res.status(401).send({
      errors: [err.message]
    }).end()
  } else {
    // console.error(err)
    res.status(500).send({
      errors: 'Internal server error'
    }).end()
  }
}

module.exports = errorMiddleware
