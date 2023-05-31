const db = require('../configs/sequelize.config')
const LessonsPlan = db.LessonsPlan
const CompletedLessons = db.CompletedLessons
const UserService = require('../service/user.service')
const {Op, QueryTypes} = require("sequelize");
const ChatRoomService = require('./chat.service')
const {sequelize} = require("../configs/sequelize.config");

const buyLesson = async data => {
    data.lessonEndTime = new Date(data.lessonStartTime)
    data.lessonEndTime.setHours(data.lessonEndTime.getHours() + 1)
    data.lessonEndTime.setMinutes(0)
    if (await UserService.isUser(data.userId)
        && await UserService.isMentor(data.mentorId)
        && !await isBusy(data)) {
        await LessonsPlan.create(data)
        await ChatRoomService.createChatRoom(data.userId, data.mentorId)
        console.log('create')
        return true
    } else {
        return false
    }
}

const isBusy = async data => {
    const lessons = await LessonsPlan.findAll({
        where: {
            mentorId: data.mentorId,
            [Op.or]: [{
                lessonStartTime: {
                    [Op.gte]: data.lessonStartTime,
                    [Op.lte]: data.lessonEndTime
                }
            },
                {
                    lessonEndTime: {
                        [Op.gte]: data.lessonStartTime,
                        [Op.lte]: data.lessonEndTime
                    }
                }]
        },
        raw: true
    })
    console.log('lessons')
    console.log(lessons)
    return !!lessons.length >= 1;
}

const getLessonsPlan = async (role, id) => {
    console.log(role)
    let lessonsPlan
    if (role === 'MENTOR') {
        // lessonsPlan = await LessonsPlan.findAll({
        //     where: {
        //         mentorId: id
        //     },
        //     raw: true
        // })
        lessonsPlan = [
            ...await sequelize.query('select t1.id, "userId", "mentorId", "lessonStartTime", "lessonEndTime", "firstName", "secondName"\n' +
            'from (select * from lessons_plan where "userId" = :userId and "lessonEndTime" > :now) t1\n' +
            'inner join (select "id", "firstName", "secondName" from usr) t2\n' +
            'on t1."mentorId" = t2.id', {
            replacements:{
                userId: id,
                now: new Date(Date.now())
            },
            type: QueryTypes.SELECT
            }),
            ...await sequelize.query('select t1.id, "userId", "mentorId", "lessonStartTime", "lessonEndTime", "firstName", "secondName"\n' +
                'from (select * from lessons_plan where "mentorId" = :userId and "lessonEndTime" > :now) t1\n' +
                'inner join (select "id", "firstName", "secondName" from usr) t2\n' +
                'on t1."mentorId" = t2.id', {
                replacements:{
                    userId: id,
                    now: new Date(Date.now())
                },
                type: QueryTypes.SELECT
            }),
        ]
    } else if (role === 'USER') {
        // lessonsPlan = await LessonsPlan.findAll({
        //     where: {
        //         userId: id
        //     },
        //     raw: true
        // })
        lessonsPlan = [
            ...await sequelize.query('select t1.id, "userId", "mentorId", "lessonStartTime", "lessonEndTime", "firstName", "secondName"\n' +
            'from (select * from lessons_plan where "mentorId" = :userId and "lessonEndTime" > :now) t1\n' +
            'inner join (select "id", "firstName", "secondName" from usr) t2\n' +
            'on t1."mentorId" = t2.id', {
            replacements:{
                userId: id,
                now: new Date(Date.now())
            },
            type: QueryTypes.SELECT
            }),
            ...await sequelize.query('select t1.id, "userId", "mentorId", "lessonStartTime", "lessonEndTime", "firstName", "secondName"\n' +
                'from (select * from lessons_plan where "userId" = :userId and "lessonEndTime" > :now) t1\n' +
                'inner join (select "id", "firstName", "secondName" from usr) t2\n' +
                'on t1."mentorId" = t2.id', {
                replacements:{
                    userId: id,
                    now: new Date(Date.now())
                },
                type: QueryTypes.SELECT
            })
            ]
    } else {
        return null
    }
    console.log(lessonsPlan)
    return lessonsPlan
}

const getLessonsPlanByDate = async (data) => {
    if (data.userRole === 'MENTOR') {
        return await LessonsPlan.findAll({
            where: {
                mentorId: data.userId,
                [Op.or]: [{
                    lessonStartTime: {
                        [Op.gte]: data.startTime,
                        [Op.lte]: data.endTime
                    }
                }]
            },
            raw: true
        })
    } else if (data.userRole === 'USER') {
        return await LessonsPlan.findAll({
            where: {
                userId: data.userId,
                [Op.or]: [{
                    lessonStartTime: {
                        [Op.gte]: data.startTime,
                        [Op.lte]: data.endTime
                    }
                }]
            },
            raw: true
        })
    }
}

const getLessons = async (data) => {
    return await sequelize.query('select lp."id", users."firstName", users."secondName", lp."userId",' +
        ' lp."mentorId", lp."lessonStartTime", lp."lessonEndTime"\n' +
        'from usr as users join (select * from lessons_plan where id in (:lessonsId))' +
        ' lp on users.id = lp."userId";',
        {
            replacements: {
                lessonsId: data.lessonsId
            },
            type: QueryTypes.SELECT
        }
    )
}

const completeLesson = async data => {
    const lesson = await LessonsPlan.findOne({
        where: {
            id: data.lessonId
        },
        raw: true
    })
    if (lesson) {
        await CompletedLessons.create(lesson)
        await LessonsPlan.destroy({
            where: lesson

        })
        return true
    } else {
        return false
    }
}

const getLessonNow = async (data) => {
    console.log(data)
    if (data.userRole === 'MENTOR') {
        return await LessonsPlan.findAll({
            where: {
                userId: data.remoteId,
                mentorId: data.userId,
                [Op.and]: [{
                    lessonStartTime: {
                        [Op.lte]: data.dateNow,
                    },
                    lessonEndTime:{
                        [Op.gte]: data.dateNow
                    }
                }]
            },
            raw: true
        })
    } else if (data.userRole === 'USER') {
        return await LessonsPlan.findAll({
            where: {
                userId: data.userId,
                mentorId: data.remoteId,
                [Op.and]: [{
                    lessonStartTime: {
                        [Op.lte]: data.dateNow,
                    },
                    lessonEndTime:{
                        [Op.gte]: data.dateNow
                    }
                }]
            },
            raw: true
        })
    }
}


module.exports = {
    buyLesson,
    completeLesson,
    getLessonsPlan,
    getLessonsPlanByDate,
    getLessons,
    getLessonNow
}