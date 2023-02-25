const {DataTypes} = require("sequelize");

module.exports = sequelize => {
    return sequelize.define('UserCategory', {
        user_id: {
            type: DataTypes.BIGINT,
            primaryKey: true
        },
        category_id: {
            type: DataTypes.BIGINT,
            primaryKey: true
        }
    }, {
        tableName: 'user_categories'
    })
}