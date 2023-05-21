const db = require('../configs/sequelize.config')
const UserDescription = db.UserDescription
const userService = require('./user.service')

const getDescription = async mentorId => {
    return await UserDescription.findOne({
        where: {
            userId: mentorId
        }
    })
}

const addDescription = async data => {
    const description = await UserDescription.findOne({
        where: {
            userId: data.id
        },
        raw: true
    })
    if (description === null) {
        await UserDescription.create({
            userId: data.id,
            employment: data.employment,
            jobPosition: data.jobPosition,
            university: data.university,
            studyField: data.studyField,
            pricePerHour: data.pricePerHour,
            description: data.description,
            city: data.city
        })
            .then(result => {
                return result
            }).catch(error => {
                console.log(error)
                return error
            })
    } else {
        await UserDescription.update({
            employment: data.employment,
            jobPosition: data.jobPosition,
            university: data.university,
            studyField: data.studyField,
            pricePerHour: data.pricePerHour,
            description: data.description,
            city: data.city
        }, {
            where: {
                userId: data.id
            }
        }).then(result => {
            return result
        }).catch(error => {
            console.log(error)
            return error
        });
    }
}

const updateDescription = async description => {
    const user = await userService.findById(description.mentorId)
    if (user.role === 'MENTOR') {
        UserDescription.update(description, {
            where: {
                userId: description.mentorId
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