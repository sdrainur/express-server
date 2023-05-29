const db = require('../configs/sequelize.config')
const UserDescription = db.UserDescription
const userService = require('./user.service')
const {UsersCategories} = require("../configs/sequelize.config");

const getDescription = async mentorId => {
    return await UserDescription.findOne({
        where: {
            userId: mentorId
        },
        raw: true
    })
}

const addDescription = async data => {
    console.log('add')
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
            city: data.city,
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

    const userCategory = await UsersCategories.findOne({
        where:{
            userId: data.id
        },
        raw: true
    })
    console.log(userCategory)
    if(!userCategory){
        console.log('creating')
        await UsersCategories.create({
            userId: data.id,
            categoryId: data.categoryId
        })
    } else {
        await UsersCategories.update({
            categoryId: data.categoryId
        }, {
            where: {
                userId: data.id
            }
        })
    }
}

const updateDescription = async description => {
    console.log(description)
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

const updateProfilePhoto = async (userId, fileName) => {
    const user = await userService.findById(userId)
    console.log(fileName)
    console.log(userId)
    if (!user) {
        return
    }
    try {
        UserDescription.update({
            profilePhotoName: fileName
        }, {
            where: {
                userId: user.id
            }
        })
    } catch (e) {
        console.log(e)
    }
}

const getPhotoFileName = async (userId) => {
    return await UserDescription.findOne({
        where: {
            userId: userId
        },
        attributes: ['profilePhotoName'],
        raw: true,
    })
}

module.exports = {
    getDescription,
    addDescription,
    updateDescription,
    updateProfilePhoto,
    getPhotoFileName
}