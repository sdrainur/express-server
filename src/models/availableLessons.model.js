const {DataTypes} = require('sequelize')

module.exports = sequelize => {
    return sequelize.define('AvailableLessons', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        mentor_id: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        count: {
            type: DataTypes.INTEGER,
        }
    },{
        tableName: 'available_lessons'
    })
}