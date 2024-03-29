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
        teachingStartDate:{
            type: DataTypes.DATEONLY
        },
        teachingEndDate:{
            type: DataTypes.DATEONLY
        },
        teachingStartHour: {
            type: DataTypes.SMALLINT,
        },
        teachingEndHour: {
            type: DataTypes.SMALLINT,
        }
    }, {
        tableName:'user_description'
    })
}