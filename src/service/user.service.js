const db = require('../configs/sequelize.config')
const User = db.User
const mailService = require('../service/mail.service')
const bcrypt = require('bcrypt')
const {sequelize} = require("../configs/sequelize.config");
const {QueryTypes} = require('sequelize');

const hashPassword = async (password, saltRounds = 10) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds)
        const hash = await bcrypt.hash(password, salt)
        return hash
    } catch (error) {
        console.log(error)
    }
    return null
}

createUser = async (data) => {
    const newUser = await User.build(data)
    newUser.password = await hashPassword(data.password)
    newUser.activationCode = Math.floor(Math.random() * (999999 - 111111)) + 111111
    await mailService.sendMail(newUser)
    await newUser.save().catch(error => {
        console.log(error)
    })
}

findAllUsers = async () => {
    return await User.findAll({
        where: {
            isActive: true,
            role: 'USER'
        },
        attributes: ['id', 'firstName', 'secondName', 'role']
    })
}

findAllMentors = async () => {
    return await User.findAll({
        where: {
            isActive: true,
            role: 'MENTOR'
        },
        attributes: ['id', 'firstName', 'secondName', 'role']
    })
}

findByEmail = async (data) => {
    const user = await User.findOne({
        where: {
            email: data
        },
        attributes: ['id', 'firstName', 'secondName', 'role']
    }).catch(error => {
        console.log(error)
    })
    return user.dataValues
}

findById = async (data) => {
    try {
        const user = await User.findOne({
            where: {
                id: data
            },
            attributes: ['id', 'firstName', 'secondName', 'role']
        })
        return user.dataValues
    } catch (error) {
        console.log(error)
        return null
    }
}

findAllById = async (data) => {
    try {
        const user = await User.findAll({
            where: {
                id: data
            },
            attributes: ['id', 'firstName', 'secondName', 'role'],
            raw: true
        })
    } catch (error) {
        console.log(error)
        return null
    }
}

isUser = async (id) => {
    console.log(isUser)
    const user = await findById(id)
    console.log(user.role)
    return user.role === 'USER'
}

isMentor = async (id) => {
    try {
        const user = await findById(id)
        return user.role === 'MENTOR'
    } catch (error) {
        console.log(error)
        return null
    }
}

findRelativeUsers = async (userId) => {
    const user = await findById(userId)
    if (user.role === 'USER') {
        return await sequelize.query('select "id", "firstName", "secondName", "role", "uuid"\n' +
            'from usr as u\n' +
            'inner join chat_room cr on u.id = cr."mentorId"\n' +
            'where cr."userId" = :userId and u.id in (select "mentorId"\n' +
            '                 from chat_room as cr\n' +
            '                 where cr."userId" = :userId);',
            {
                replacements: {
                    userId: userId
                },
                type: QueryTypes.SELECT
            }
        )
    } else if (user.role === 'MENTOR') {
        return await sequelize.query('select "id", "firstName", "secondName", "role", "uuid"\n' +
            'from usr as u\n' +
            'inner join chat_room cr on u.id = cr."userId"\n' +
            'where cr."mentorId" = :userId and u.id in (select "userId"\n' +
            '                 from chat_room as cr\n' +
            '                 where cr."mentorId" = :userId);',
            {
                replacements: {
                    userId: userId
                },
                type: QueryTypes.SELECT
            }
        )
    } else {
        return null
    }
}

activateUser = async (data) => {
    User.update({
            isActive: true,
            activationCode: null
        }, {
            where: {
                activationCode: data.activationCode
            }
        }
    )
        .then(result => {
            console.log(`User is activated! ${result}`)
        })
        .catch(error => {
            console.log(`Error! ${error}`)
        })
}

changeName = async (data) => {
    await User.update({
        firstName: data.firstName,
        secondName: data.secondName
    }, {
        where: {
            id: data.id
        },
    })
        .then(() => {
            return true
        })
        .catch(() => {
            return false
        })
}

const changeRole = async (data) => {
    console.log(data)
    return !!(await User.update({
        role: data.role,
    }, {
        where: {
            id: data.userId
        }
    }));
}

module.exports = {
    createUser,
    activateUser,
    findByEmail,
    findById,
    findAllUsers,
    findAllMentors,
    isUser,
    isMentor,
    findRelativeUsers,
    changeName,
    changeRole
}