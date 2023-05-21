const {origin} = require("../service/urls.service");
const corsOptions = {
    origin: origin,
    optionsSuccessStatus: 200
}

module.exports = {
    corsOptions
}