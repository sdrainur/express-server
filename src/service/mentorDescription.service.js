const db = require('../configs/sequelize.config')
const MentorDescription = db.MentorDescription
const userService = require('./user.service')

const getDescription = async mentorId => {
    return await MentorDescription.findOne({
        where: {
            mentorId: mentorId
        }
    })
}

const addDescription = async description => {
    const user = await userService.findById(description.mentorId)
    if (user.role === 'MENTOR') {
        await MentorDescription.create(description)
            .then(result => {
                return result
            }).catch(error => {
                return error
            })
    }
}

const updateDescription = async description => {
    const user = await userService.findById(description.mentorId)
    if (user.role === 'MENTOR') {
        MentorDescription.update(description, {
            where: {
                mentorId: description.mentorId
            }
        }).then(result => {
            return result
        }).catch(error => {
            console.log(error)
        })
    }
}

module.exports = {
    getDescription,
    addDescription,
    updateDescription
}