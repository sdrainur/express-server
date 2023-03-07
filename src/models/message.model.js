const {DataTypes} = require('sequelize')

module.exports = sequelize => {
    return sequelize.define('Message', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        type:{
            type: DataTypes.ENUM(
                'FILE',
                'TEXT'
            ),
            allowNull: false
        },
        chatRoom: {
            type: DataTypes.UUID
        },
        textOrFilePath: {
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