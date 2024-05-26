'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('m_users', {
            username: {
                allowNull: false,
                primaryKey: true,
                type: Sequelize.STRING
            },
            password: {
                allowNull: false,
                type: Sequelize.STRING
            },
            email: {
                allowNull: false,
                type: Sequelize.STRING
            },
            phone: {
                type: Sequelize.STRING
            },
            address: {
                type: Sequelize.STRING
            },
            token: {
                type: Sequelize.TEXT
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deletedAt: {
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('m_users');
    }
};