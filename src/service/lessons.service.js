const db = require('../configs/sequelize.config')
const LessonsPlan = db.LessonsPlan
const CompletedLessons = db.CompletedLessons
const UserService = require('../service/user.service')
const {Op} = require("sequelize");
const ChatRoomService = require('./chat.service')

const buyLesson = async data => {
    data.lessonEndTime = new Date(data.lessonStartTime)
    data.lessonEndTime.setHours(data.lessonEndTime.getHours() + 1)
    data.lessonEndTime.setMinutes(0)
    if (await UserService.isUser(data.userId)
        && await UserService.isMentor(data.mentorId)
        && !await isBusy(data)) {
        await LessonsPlan.create(data)
        await ChatRoomService.createChatRoom(data.userId, data.mentorId)

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
    return !!lessons.length >= 1;
}

const getLessonsPlan = async (role, id) => {
    let lessonsPlan
    if (role === 'MENTOR') {
        lessonsPlan = await LessonsPlan.findAll({
            where: {
                mentorId: id
            },
            raw: true
        })
    } else if (role === 'USER') {
        lessonsPlan = await LessonsPlan.findAll({
            where: {
                userId: id
            },
            raw: true
        })
    } else {
        return null
    }
    return lessonsPlan
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

module.exports = {
    buyLesson,
    completeLesson,
    getLessonsPlan
}