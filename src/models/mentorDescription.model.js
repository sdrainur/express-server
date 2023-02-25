const {DataTypes} = require('sequelize')

module.exports = sequelize => {
    return sequelize.define('MentorDescription', {
        mentorId: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        employment: {
            type: DataTypes.STRING,
            allowNull: false
        },
        university: {
            type: DataTypes.STRING,
            allowNull: true
        },
        studyField: {
            type: DataTypes.STRING,
            allowNull: true
        },
        pricePerHour: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName:'mentor_description'
    })
}