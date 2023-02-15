const db = require('../configs/sequelize.config')
const User = db.user

findUser = async (data) => {
    const user = await User.findOne({
        where: {
            email: data
        },
        attributes: ['email', 'password']
    }).catch(error => {
        console.log(error)
    })
    return user.dataValues
}

module.exports={
    findUser
}