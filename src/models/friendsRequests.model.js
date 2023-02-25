const {DataTypes} = require("sequelize");

module.exports = sequelize => {
    return sequelize.define('FriendRequests', {
        sender_id: {
            type: DataTypes.BIGINT,
            primaryKey: true
        },
        receiver_id: {
            type: DataTypes.BIGINT,
            primaryKey: true
        }
    }, {
        tableName: 'friends_requests'
    })
}