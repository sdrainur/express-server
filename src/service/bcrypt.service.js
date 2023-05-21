const bcrypt = require('bcrypt')

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

module.exports = {
    hashPassword
}