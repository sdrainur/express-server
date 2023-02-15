const corsOptions = require('../middlewares/cors.config')
const cors = require('cors')
const {authenticateToken} = require("../middlewares/jwt.middleware");
const friendsService = require('../service/friends.service')

module.exports = app => {
    app.post('/friends/send-request', cors(corsOptions), authenticateToken, (req, res) => {
        console.log(req.body)
        friendsService.sendRequest(req.body.sender_id, req.body.receiver_id)
            .then(() => {
                res.send()
            }).catch()
    })

    app.post('/friends/accept-request', cors(corsOptions), authenticateToken, (req, res) => {
        friendsService.acceptRequest(req.body.sender_id, req.body.receiver_id)
            .then(() => {
                res.send("success")
            }).catch(error => {
            res.status(400).send(error)
        })
    })

    app.get('/friends', cors(corsOptions), authenticateToken, (req, res) => {
        friendsService.getFriends(1).then(result => console.log(result))
        res.end()
    })
}
