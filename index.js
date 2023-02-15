const express = require('express');
const app = express()
const port = process.env.PORT ?? 4000
const cors = require('cors')
const {authenticateToken} = require("./src/middlewares/jwt.middleware");
// const sequelizeConfig = require('./src/configs/sequelize.config')

// const corsOptions = {
//     origin: 'http://localhost:3000',
//     optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

app.use(express.json())
// app.use(authenticateToken)
app.use(cors())

require('./src/controllers/main.controller.js')(app)
require('./src/controllers/signup.controller.js')(app)
require('./src/controllers/login.controller')(app)
require('./src/controllers/users.controller')(app)
require('./src/controllers/friends.controller')(app)

app.listen(port,()=>{
    console.log(`Server started at port ${port}...`)
})
