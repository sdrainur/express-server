const db = require('../configs/sequelize.config')
const User = db.User
const jwtDecode = require('jwt-decode')

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

decodeJwt = (token) => {
    return jwtDecode(token);
}

module.exports = {
    decodeJwt,
    findUser
}