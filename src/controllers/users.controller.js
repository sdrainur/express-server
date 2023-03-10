const corsOptions = require('../middlewares/cors.config')
const cors = require('cors')
const usersFriendsService = require('../service/friends.service')
const userService = require('../service/user.service')
const {authenticateToken} = require("../middlewares/jwt.middleware");
const jwtDecode = require("jwt-decode");
const UserService = require("../service/user.service");
const AuthService = require("../service/auth.service");

module.exports = (app) => {
    app.get('/addFriend', cors(corsOptions), (req, res) => {
        usersFriendsService.addFriend(1, 2).then(
            res.end()
        )
    })

    app.get('/users/get', cors(corsOptions), authenticateToken, (req, res) => {
        userService.findAllUsers()
            .then(result => {
                res.status(200).json(result)
            })
            .catch(error => {
                res.status(400).json(error)
            })
    })

    app.get('/mentors/get', cors(corsOptions), authenticateToken, (req, res) => {
        userService.findAllMentors()
            .then(result => {
                res.status(200).json(result)
            })
            .catch(error => {
                res.status(400).json(error)
            })
    })

    app.get('/user', cors(corsOptions), authenticateToken, (req, res) => {
        const token = req.headers.authorization.split(' ')[1]
        userService.findByEmail(jwtDecode(token).email).then(result => {
            res.status(200).json(result)
        })
            .catch(error => {
                res.status(400).json(error)
            })
    })

    app.get('/user/:id', cors(corsOptions), authenticateToken, (req, res) => {
        userService.findById(req.params.id).then(result => {
            res.status(200).json(result)
        })
            .catch(error => {
                res.status(400).json(error)
            })
    })

    app.get('/related-users-list', cors(corsOptions), authenticateToken, (req, res) => {
        const token = req.headers.authorization.split(' ')[1]
        UserService.findRelativeUsers(AuthService.decodeJwt(token).id)
            .then(result => {
                console.log(res)
                res.status(200).json(result)
            }).catch(error => {
            res.status(400).json(error)
        })
    })
}

