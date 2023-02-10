const corsOptions = require('../middlewares/cors.config')
const cors = require('cors')
const userService = require('../service/user.service')
const jwt = require('../middlewares/jwt.middleware')
const bcrypt = require('bcrypt')

module.exports = (app) => {
    app.get('/login', cors(corsOptions), (req, res) => {
        console.log(req.body)
        userService.findByEmail(req.body.email)
            .then(user => {
                if (!user) return res.status(400).json({message: "User not exists"})
                bcrypt.compare(req.body.password, user.password, (err, data) => {
                    if(err) throw err
                    if(data) {
                        res.status(200).json({
                            'type': 'Bearer',
                            'accessToken': jwt.generateAccessToken(user.email)
                        })
                    } else {
                        return res.status(401).json({message: "Invalid credential"})
                    }
                })
            })
    })
}
