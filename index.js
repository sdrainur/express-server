const express = require('express');
const app = express()
const port = process.env.PORT ?? 4000
const cors = require('cors')
const http = require('http').createServer(app)
const {Server} = require('socket.io')

app.use(express.json())
app.use(cors())

const io = new Server(http, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"]
    }
})


require('./src/controllers/main.controller.js')(app)
require('./src/controllers/signup.controller.js')(app)
require('./src/controllers/login.controller')(app)
require('./src/controllers/users.controller')(app)
require('./src/controllers/friends.controller')(app)
require('./src/controllers/mentorDescription.controller')(app)
require('./src/controllers/lessons.controller')(app)
require('./src/controllers/chat.controller')(app, io)



http.listen(port, () => {
    console.log(`Server started at port ${port}...`)
})
