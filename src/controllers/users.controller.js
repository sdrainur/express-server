const corsOptions = require('../middlewares/cors.config')
const cors = require('cors')
const usersFriendsService = require('../service/friends.service')
const userService = require('../service/user.service')

module.exports = (app) => {
    app.get('/addFriend', cors(corsOptions), (req, res) => {
        usersFriendsService.addFriend(1, 2).then(
            res.end()
        )
    })

    app.get('/get', cors(corsOptions), (req, res) => {
        userService.findAll()
            .then(result => {
                res.status(200).json(result)
            })
            .catch(error => {
                res.status(400).json(error)
            })
    })
}
