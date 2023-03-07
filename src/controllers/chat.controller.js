const cors = require('cors')
const {corsOptions} = require("../middlewares/cors.config");
const {authenticateToken} = require("../middlewares/jwt.middleware");
const ChatService = require('../service/chat.service')
const AuthService = require('../service/auth.service')
const UserService = require('../service/user.service')
const jwt = require("jsonwebtoken");

module.exports = (app, io) => {
    app.get('/messages/:uuid', cors(corsOptions), authenticateToken, (req, res) => {
        ChatService.getMessages(req.params.uuid).then(
            result => {
                res.status(200).send(result)
            }
        ).catch(error => {
            res.status(400).send(error)
        })
    })

    io.use((socket, next) => {
        const authHeader = socket.handshake.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) {
            return next(new Error('Authentication error'))
        }
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) return next(new Error('Authentication error'))
            next()
        })
    })

    io.on('connection', (socket) => {
        const authHeader = socket.handshake.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]
        // const userId = socket.handshake.query.userId

        socket.on('join', async data => {
            console.log(data.userId)
            if (await UserService.findById(data.userId)) {
                socket.join(data.userId)
                console.log(data.userId + ' joined to chat')
            }
        })

        socket.on('chat', async ({data, to, from}) => {
            const userId = AuthService.decodeJwt(token).id
            io.to(to).to(from).emit('chat', {
                message: await ChatService.postTextMessage(data.uuid, data.text, userId)
            })
        })

        socket.on('leave', data => {
            socket.leave(data.userId)
            console.log(data.userId + ' left this chat')
        })
    })


}