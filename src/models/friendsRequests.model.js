const {DataTypes} = require("sequelize");

module.exports = sequelize => {
    return sequelize.define('friends_requests', {
        sender_id:{
            type: DataTypes.BIGINT,
            primaryKey: true
        },
        receiver_id:{
            type: DataTypes.BIGINT,
            primaryKey: true
        }
    })
}