const {DataTypes} = require('sequelize')

module.exports = sequelize => {
    return sequelize.define('Category', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    }, {
        tableName: 'category'
    })
}