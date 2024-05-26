'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {

        }
    }
    User.init({
        username: { primaryKey: true, type: DataTypes.STRING },
        password: DataTypes.STRING,
        email: DataTypes.STRING,
        phone: DataTypes.STRING,
        address: DataTypes.STRING,
        token: DataTypes.STRING
    }, {
        sequelize,
        tableName: 'm_users',
        paranoid: true
    });
    return User;
};