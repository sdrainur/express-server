const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
dotenv.config()

function generateAccessToken(data) {
    return jwt.sign({
            id: data.id,
            email: data.email,
            role: data.role
        },
        process.env.SECRET_KEY,
        {
            algorithm: 'HS256'
        })
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization']

    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)

    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        console.log(err)
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

module.exports = {
    generateAccessToken,
    authenticateToken
}