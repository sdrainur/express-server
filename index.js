const express = require('express');
const app = express()
const port = process.env.PORT ?? 4000
const cors = require('cors')

app.use(express.json())
app.use(cors())

require('./src/controllers/main.controller.js')(app)
require('./src/controllers/signup.controller.js')(app)
require('./src/controllers/login.controller')(app)
require('./src/controllers/users.controller')(app)
require('./src/controllers/friends.controller')(app)
require('./src/controllers/mentorDescription.controller')(app)
require('./src/controllers/lessons.controller')(app)

app.listen(port,()=>{
    console.log(`Server started at port ${port}...`)
})
