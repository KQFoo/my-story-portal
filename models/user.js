const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        user_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        user_name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: Sequelize.NOW
        }
    }, {
        sequelize,
        tableName: 'user',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        // indexes: [{
        //     name: 'PRIMARY_USER',
        //     unique: true,
        //     using: 'BTREE',
        //     fields: [{
        //         name: 'user_id'
        //     }]
        // }, {
        //     name: 'user_name',
        //     unique: true,
        //     using: 'BTREE',
        //     fields: [{
        //         name: 'user_name'
        //     }]
        // }]
    });
};
