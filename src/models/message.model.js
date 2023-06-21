const {DataTypes} = require('sequelize')

module.exports = sequelize => {
    return sequelize.define('Message', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        chatRoom: {
            type: DataTypes.UUID
        },
        text: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        sender: {
            type: DataTypes.BIGINT,
            allowNull: false
        }
    }, {
        tableName: 'message'
    })
}