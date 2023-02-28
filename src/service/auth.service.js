const db = require('../configs/sequelize.config')
const User = db.User

findUser = async (data) => {
    const user = await User.findOne({
        where: {
            email: data
        },
        attributes: ['id', 'email', 'password', 'role']
    }).catch(error => {
        console.log(error)
    })
    return user.dataValues
}

module.exports={
    findUser
}