const {DataTypes} = require("sequelize");

module.exports = sequelize => {
    return sequelize.define('CompletedLessons', {
        id: {
            type: DataTypes.BIGINT,
            autoIncrement: true,
            primaryKey: true
        },
        userId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        mentorId: {
            type: DataTypes.BIGINT,
            allowNull: false
        },
        lessonStartTime:{
            type: DataTypes.DATE,
            allowNull: false,
        },
        lessonEndTime:{
            type:DataTypes.DATE,
            allowNull: false
        }
    }, {
        tableName: 'completed_lessons'
    })
}