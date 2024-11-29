const Sequelize = require('sequelize');

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('post', {
        post_id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'user_id'
            }
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        post_content: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        views: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        music_url: {
            type: DataTypes.STRING(255),
            isUrl: true,
            allowNull: true // post can be created without a music url
        },
        music_platform: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        embed_url: {
            type: DataTypes.STRING(255),
            isUrl: true,
            allowNull: true
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
        tableName: 'post',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
        // indexes: [
        //     {
        //         name: 'PRIMARY',
        //         unique: true,
        //         using: 'BTREE',
        //         fields: [{
        //             name: 'post_id'
        //         }]
        //     },
        //     {
        //         name: 'post_user_id_fk',
        //         using: 'BTREE',
        //         fields: [{
        //             name: 'user_id'
        //         }]
        //     }
        // ]
    });
};

