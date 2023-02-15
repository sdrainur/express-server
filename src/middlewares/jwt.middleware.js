const dotenv = require('dotenv')
const jwt = require('jsonwebtoken')
dotenv.config()

function generateAccessToken(data) {
    console.log(process.env.SECRET_KEY)
    return jwt.sign({
            email: data
        },
        process.env.SECRET_KEY,
        {
            algorithm: 'HS256'
        })
}

function authenticateToken(req, res, next) {
    console.log(req)
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