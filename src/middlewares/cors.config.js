const {origin} = require("../service/urls.service");
const corsOptions = {
    origin: origin,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

module.exports = {
    corsOptions
}