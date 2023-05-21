const express = require('express');
const app = express()
const port = process.env.PORT ?? 4000
const cors = require('cors')
const http = require('http').createServer(app)
const {Server} = require('socket.io')
const {origin} = require("./src/service/urls.service");

app.use(express.json())
app.use(cors())

const io = new Server(http, {
    cors: {
        origin: origin,
        methods: ["GET", "POST"]
    }
})


require('./src/controllers/main.controller.js')(app)
require('./src/controllers/signup.controller.js')(app)
require('./src/controllers/login.controller')(app)
require('./src/controllers/users.controller')(app)
require('./src/controllers/friends.controller')(app)
require('./src/controllers/userDescription.controller')(app)
require('./src/controllers/lessons.controller')(app)
require('./src/controllers/chat.controller')(app, io)
require('./src/controllers/feedback.controller')(app)



http.listen(port, () => {
    console.log(`Server started at port ${port}...`)
})
