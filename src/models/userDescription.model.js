const {DataTypes} = require('sequelize')

module.exports = sequelize => {
    return sequelize.define('UserDescription', {
        userId: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        employment: {
            type: DataTypes.STRING,
        },
        jobPosition: {
            type: DataTypes.STRING,
        },
        university: {
            type: DataTypes.STRING,
        },
        studyField: {
            type: DataTypes.STRING,
        },
        pricePerHour: {
            type: DataTypes.INTEGER,
        },
        description: {
            type: DataTypes.TEXT,
        },
        city: {
            type: DataTypes.STRING,
        },
        profilePhotoName:{
            type: DataTypes.STRING,
        },
        teachingStartTime: {
            type: DataTypes.DATE,
        },
        teachingEndTime: {
            type: DataTypes.DATEONLY,
        }
    }, {
        tableName:'user_description'
    })
}