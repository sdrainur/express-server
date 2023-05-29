const {DataTypes} = require("sequelize");

module.exports = sequelize => {
    return sequelize.define('UserCategory', {
        userId: {
            type: DataTypes.BIGINT,
        },
        categoryId: {
            type: DataTypes.BIGINT,
        }
    }, {
        tableName: 'user_categories'
    })
}