const corsOptions = require('../middlewares/cors.config')
const cors = require('cors')
const jwt = require('../middlewares/jwt.middleware')
const bcrypt = require('bcrypt')
const authService = require('../service/auth.service')

module.exports = (app) => {
    app.post('/login', cors(corsOptions), (req, res) => {
        authService.findUser(req.body.email)
            .then(user => {
                if (!user) return res.status(400).json({message: "User not exists"})
                bcrypt.compare(req.body.password, user.password, (err, data) => {
                    if (err) {
                        console.log('error')
                        throw err
                    }
                    if (data) {
                        res.status(200).json({
                            'accessToken': jwt.generateAccessToken({
                                id: user.id,
                                email: user.email,
                                role: user.role
                            }),
                            'id': user.id,
                            'role': user.role
                        })
                    } else {
                        return res.status(401).json({message: "Invalid credential"})
                    }
                })
            })
    })
}
