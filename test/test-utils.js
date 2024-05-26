const { User } = require('../src/models')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.removeUser = async () => {
    await User.destroy({
        where: {
            phone: '081234567890'
        },
        force: true
    })
}

exports.createUser = async (username, email) => {
    await User.create({
        username: username,
        password: bcrypt.hashSync('rahasia123', 10),
        email: email,
        phone: '081234567890',
        address: 'test'
    })
}

exports.loginUser = async () => {
    const token = jwt.sign({ username: 'testuser' }, 'FAISALGANTENG', { expiresIn: 60 * 60 })

    await User.update({
        token
    }, {
        where: {
            username: 'testuser'
        }
    })

    return token
}