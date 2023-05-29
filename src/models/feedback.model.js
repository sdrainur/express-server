const {DataTypes} = require("sequelize");
module.exports = sequelize => {
    return sequelize.define('LessonsPlan', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        mentorId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        authorId: {
            type: DataTypes.BIGINT,
            allowNull: false,
        },
        score: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },
        text: {
            type: DataTypes.TEXT
        }
    }, {
        tableName: 'feedback',
        indexes: [
            {
                unique: true,
                fields: ['mentorId', 'authorId']
            }
        ]
    })
}