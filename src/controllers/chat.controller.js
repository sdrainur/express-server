const cors = require('cors')
const {corsOptions} = require("../middlewares/cors.config");
const {authenticateToken} = require("../middlewares/jwt.middleware");
const ChatService = require('../service/chat.service')
const AuthService = require('../service/auth.service')
const UserService = require('../service/user.service')
const jwt = require("jsonwebtoken");
const {compare} = require("bcrypt");

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

        socket.on('join', async data => {
            if (await UserService.findById(data.userId)) {
                socket.join(data.userId)
            }
        })

        socket.on('chat', async ({data, to, from}) => {
            const userId = AuthService.decodeJwt(token).id
            io.to(to).to(from).emit('chat', {
                message: await ChatService.postTextMessage(data.uuid, data.text, userId),
                to: to,
                from: from
            })
        })

        socket.on('peerInvite', async (data) => {

            io.to(data.targetId).emit('peerInvite', {
                data
            })
        })

        socket.on('leave', data => {
            socket.leave(data.userId)
        })

        socket.on('openCall', (data) => {

            io.to(data.to).emit('openCall')
        })

        socket.on('openAudioCall', (data) => {

            io.to(data.to).emit('openAudioCall')
        })


        socket.on('relay_sdp', (data) => {

            io.to(data.to).emit('session_description', data.sdp)
        })

        socket.on('relay_ice', (data) => {
            io.to(data.to).emit('ice_candidate', data.ice)
        })

        socket.on('call', (data) => {
            io.to(data.to).emit('call', {
                from: data.from,
                type: data.type
            })
        })

        socket.on('audioCall', (data) => {
            io.to(data.to).emit('audioCall', {
                from: data.from,
                type: data.type
            })
        })
    })
}
