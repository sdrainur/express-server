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
    console.log(data)
    const description = await UserDescription.findOne({
        where: {
            userId: data.id
        },
        raw: true
    })
    console.log(description)
    console.log(description === null)
    if (description === null) {
        console.log('creating')
        console.log(data)
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
                console.log(result)
                return result
            }).catch(error => {
                console.log(error)
                return error
            })
    } else {
        console.log('editing')
        console.log(description)
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
            console.log(result)
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