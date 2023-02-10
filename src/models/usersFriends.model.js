const DataTypes = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('UsersFriends', {
            user_id: {
                type: DataTypes.BIGINT,
                allowNull: false
            },
            friend_id: {
                type: DataTypes.BIGINT,
                allowNull: false
            },
        }, {
            tableName: 'users_friends'
        }
    );
}