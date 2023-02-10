const db = require('../configs/sequelize.config')
const User = db.user
const mailService = require('../service/mail.service')
const bcrypt = require('bcrypt')

const hashPassword = async (password, saltRounds = 10) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds)
        const hash = await bcrypt.hash(password, salt)
        console.log(hash)
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

findAll = async () => {
    return await User.findAll({
        where: {
            isActive: true,
            role: 'USER'
        },
        attributes: ['id', 'firstName', 'secondName']
    })
}

findByEmail = async (data) => {
    const user = await User.findOne({
        where: {
            email: data
        }
    }).catch(error => {
        console.log(error)
    })
    return user.dataValues
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


module.exports = {
    createUser,
    activateUser,
    findByEmail,
    findAll
}