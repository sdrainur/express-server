const cors = require('cors')
const {corsOptions} = require("../middlewares/cors.config");
const {authenticateToken} = require("../middlewares/jwt.middleware");
const ChatRoomService = require('../service/chatRoom.service')

module.exports = app => {
    app.get('/chat-list/:userId', cors(corsOptions), authenticateToken, (req, res) => {
        ChatRoomService.findChatRoomByUserId(req.params.role)
            .then(result => {
                res.status(200).json(result)
            }).catch(error => {
            res.status(400).json(error)
        })
    })
}