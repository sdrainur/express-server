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
        const arr1 = await sequelize.query('select t1.id, t1.role, t1."firstName", t1."secondName", t2."profilePhotoName", t1.uuid ' +
            'from (select "id", "firstName", "secondName", "role", "uuid"\n' +
            'from usr as u\n' +
            'inner join chat_room cr on u.id = cr."mentorId"\n' +
            'where cr."userId" = :userId and u.id in (select "mentorId"\n' +
            '                 from chat_room as cr\n' +
            '                 where cr."userId" = :userId or cr."mentorId" = :userId)) t1\n' +
            'inner join\n' +
            '(select "userId", "profilePhotoName" from user_description) t2\n' +
            'on t1.id = t2."userId";',
            {
                replacements: {
                    userId: userId
                },
                type: QueryTypes.SELECT
            }
        )
        const arr2 = await sequelize.query('select t1.id, t1.role, t1."firstName", t1."secondName", t2."profilePhotoName", t1.uuid ' +
            'from (select "id", "firstName", "secondName", "role", "uuid"\n' +
            '            from usr as u\n' +
            '            inner join chat_room cr on u.id = cr."userId"\n' +
            '            where cr."mentorId" = :userId and u.id in (select "userId"\n' +
            '                             from chat_room as cr\n' +
            '                             where cr."mentorId" = :userId or cr."userId" = :userId)) t1\n' +
            'inner join\n' +
            '(select "userId", "profilePhotoName" from user_description) t2\n' +
            'on t1.id = t2."userId";',
            {
                replacements: {
                    userId: userId
                },
                type: QueryTypes.SELECT
            }
        )
        return [...arr1, ...arr2]
    } else if (user.role === 'MENTOR') {
        const arr1 = await sequelize.query('select t1.id, t1.role, t1."firstName", t1."secondName", t2."profilePhotoName", t1.uuid ' +
            'from (select "id", "firstName", "secondName", "role", "uuid"\n' +
            'from usr as u\n' +
            'inner join chat_room cr on u.id = cr."userId"\n' +
            'where cr."mentorId" = :userId and u.id in (select "userId"\n' +
            '                 from chat_room as cr\n' +
            '                 where cr."mentorId" = :userId or cr."userId" = :userId)) t1\n' +
            'inner join\n' +
            '(select "userId", "profilePhotoName" from user_description) t2\n' +
            'on t1.id = t2."userId"',
            {
                replacements: {
                    userId: userId
                },
                type: QueryTypes.SELECT
            }
        )
        const arr2 = await sequelize.query('select t1.id, t1.role, t1."firstName", t1."secondName", t2."profilePhotoName", t1.uuid ' +
            'from (select "id", "firstName", "secondName", "role", "uuid"\n' +
            '            from usr as u\n' +
            '            inner join chat_room cr on u.id = cr."mentorId"\n' +
            '            where cr."userId" = :userId and u.id in (select "mentorId"\n' +
            '                             from chat_room as cr\n' +
            '                             where cr."userId" = :userId)) t1\n' +
            'inner join\n' +
            '(select "userId", "profilePhotoName" from user_description) t2\n' +
            'on t1.id = t2."userId"',
            {
                replacements: {
                    userId: userId
                },
                type: QueryTypes.SELECT
            }
        )
        return [...arr1, ...arr2]
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

const getAllUsersInfo = async () => {
    const data = await sequelize.query('select * from (select t1.id, t1.role, t1."firstName", t1."secondName", t1.categoryId as categoryId, t1.name as categoryName, t2.avg as score\n' +
        '               from (select usr.id, usr.role, usr."firstName", usr."secondName", c.id as categoryId, c.name\n' +
        '                     from usr join user_categories uc on usr.id = uc."userId"\n' +
        '                            join category c on c.id = uc."categoryId") t1\n' +
        '                            inner join (select usr.id, avg(f.score)from usr join feedback f on usr.id = f."mentorId"                                                                                                    group by usr.id) t2\n' +
        '                            on t1.id = t2.id) table1\n' +
        'inner join (select "userId", "profilePhotoName", "pricePerHour" from user_description) table2\n' +
        'on table1.id = table2."userId"', {raw: true})
    return data[0]
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
    changeRole,
    getAllUsersInfo
}