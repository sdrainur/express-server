const corsOptions = require('../middlewares/cors.config')
const cors = require('cors')
const {authenticateToken} = require("../middlewares/jwt.middleware");
const bcrypt = require('bcrypt')
const bcryptService = require('../service/bcrypt.service')

module.exports = (app) => {
    app.get('/', cors(corsOptions), authenticateToken, (req, res) => {
        console.log(req.headers)
        res.json({username: "Ainur"})
    })

    app.get('/bcrypt', cors(corsOptions), (req, res) => {
        const hash = bcryptService.hashPassword()
        bcrypt.compare()
    })
}