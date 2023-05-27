const {DataTypes} = require("sequelize");

// module.exports = sequelize => {
//     return sequelize.define('LessonsPlan', {
//         id:{
//             type: DataTypes.BIGINT,
//             primaryKey: true,
//             autoIncrement:true
//         },
//         userId: {
//             type: DataTypes.BIGINT,
//             allowNull: false,
//             unique:false
//         },
//         mentorId:{
//             type: DataTypes.BIGINT,
//             allowNull: false,
//             unique: false
//         },
//         lessonStartTime:{
//             type: DataTypes.DATE,
//             allowNull: false,
//         },
//         lessonEndTime:{
//             type:DataTypes.DATE,
//             allowNull: false
//         }
//     }, {
//         tableName: 'lessons_plan',
//         indexes:[
//             {
//                 unique:false,
//                 fields: ['userId', 'mentorId']
//             }
//         ]
//     })
// }

module.exports = (sequelize) => {
    return sequelize.define('LessonsPLan', {
            id: {
                type: DataTypes.BIGINT,
                primaryKey: true,
                autoIncrement: true
            },
            userId: {
                type: DataTypes.BIGINT,
                allowNull: false,
                unique: false
            },
            mentorId: {
                type: DataTypes.BIGINT,
                allowNull: false,
                unique: false
            },
            lessonStartTime: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            lessonEndTime: {
                type: DataTypes.DATE,
                allowNull: false
            }
        }, {
            tableName: 'lessons_plan',
            indexes: [
                {
                    unique: false,
                    fields: ['userId', 'mentorId']
                }
            ]
        }
    );
}