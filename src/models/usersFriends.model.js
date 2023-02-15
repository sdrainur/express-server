const DataTypes = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('UsersFriends', {
            user_id: {
                type: DataTypes.BIGINT,
                primaryKey: true
            },
            friend_id: {
                type: DataTypes.BIGINT,
                primaryKey: true
            }
        }, {
            tableName: 'users_friends'
        }
    );
}