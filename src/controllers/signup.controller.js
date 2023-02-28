const corsOptions = require('../middlewares/cors.config')
const cors = require('cors')
const mailService = require('../service/mail.service')
const userService = require('../service/user.service')

module.exports = (app) => {
    app.post('/signup', cors(corsOptions), (req, res) => {
        userService.createUser(req.body).then(
            res.end()
        )
    })

    app.post('/signup/activate', cors(corsOptions), (req, res) => {
        userService.activateUser({
            activationCode: req.body.activationCode
        }).then(
            res.end()
        )
    })

    app.get('/mail', cors(corsOptions), (req, res) => {
        mailService.sendMail().then(r => console.log(r))
        res.end()
    })
}
