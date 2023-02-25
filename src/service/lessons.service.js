const db = require('../configs/sequelize.config')
const LessonsPlan = db.LessonsPlan
const CompletedLessons = db.CompletedLessons
const UserService = require('../service/user.service')
const {Op} = require("sequelize");

const buyLesson = async data => {
    data.lessonEndTime = new Date(data.lessonStartTime)
    data.lessonEndTime.setHours(data.lessonEndTime.getHours() + 1)
    data.lessonEndTime.setMinutes(0)
    console.log(data)
    if (await UserService.isUser(data.userId)
        && await UserService.isMentor(data.mentorId)
        && !await isBusy(data)) {
        await LessonsPlan.create(data)
        console.log('Created')
        return true
    } else {
        console.log('Not created')
        return false
    }
}

const isBusy = async data => {
    console.log('checking business')
    console.log(data)
    console.log(typeof (data.lessonStartTime))
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
    console.log(lessons)
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
    console.log(lesson)
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