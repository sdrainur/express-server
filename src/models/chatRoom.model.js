const {DataTypes} = require('sequelize')

module.exports = sequelize => {
    return sequelize.define('ChatRoom', {
        uuid: {
            type: DataTypes.UUID,
            primaryKey: true
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        mentorId: {
            type: DataTypes.BIGINT,
            allowNull: false
        }
    }, {
        tableName: 'chat_room'
    })
}