var DataTypes = require('sequelize');
var _user = require('./user');
var _post = require('./post');

function initModels(sequelize) {
    var user = _user(sequelize, DataTypes);
    var post = _post(sequelize, DataTypes);

    user.hasMany(post, { foreignKey: 'user_id' });
    post.belongsTo(user, { foreignKey: 'user_id' });

    return {
        user,
        post
    }
}

module.exports = initModels;
