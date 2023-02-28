const cors = require('cors')
const {corsOptions} = require("../middlewares/cors.config");
const {authenticateToken} = require("../middlewares/jwt.middleware");
const mentorDescriptionService = require("../service/mentorDescription.service")

module.exports = app => {
    app.get('/mentor/description/', cors(corsOptions), authenticateToken, (req, res) => {
        mentorDescriptionService.getDescription(req.body.mentorId)
            .then(result => {
                res.status(200).json(result)
            }).catch(error => {
            res.status(400).json(error)
        })
    })

    app.post('/mentor/description/', cors(corsOptions), authenticateToken, (req, res) => {
        mentorDescriptionService.addDescription(req.body)
            .then(result => {
                res.status(200).json({message: 'Description created'})
            }).catch(error => {
            res.status(400).json({message: 'Bad request'})
        })
    })

    app.put('/mentor/description', cors(corsOptions), authenticateToken, (req, res) => {
        mentorDescriptionService.updateDescription(req.body)
            .then(result => {
                res.status(200).json({message: 'Description updated'})
            }).catch(error => {
            res.status(400).json({message: 'Bad request'})
        })
    })
}