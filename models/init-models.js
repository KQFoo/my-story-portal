var DataTypes = require('sequelize');
var _user = require('./user');
var _post = require('./post');

function initModels(sequelize) {
    var user = _user(sequelize, DataTypes);
    var post = _post(sequelize, DataTypes);

    post.belongsTo(user, { as: 'user', foreignKey: 'user_id' });
    user.hasMany(post, { as: 'posts', foreignKey: 'user_id' });

    return {
        user,
        post
    }
}

module.exports = initModels;
