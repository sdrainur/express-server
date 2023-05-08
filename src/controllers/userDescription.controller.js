const cors = require('cors')
const {corsOptions} = require("../middlewares/cors.config");
const {authenticateToken} = require("../middlewares/jwt.middleware");
const mentorDescriptionService = require("../service/mentorDescription.service")
const {getAuthenticationInfo} = require("../service/auth.service");

module.exports = app => {
    app.get('/user-description/', cors(corsOptions), authenticateToken, (req, res) => {
        const user = getAuthenticationInfo(req.headers.authorization.split(' ')[1])
        mentorDescriptionService.getDescription(user.userId)
            .then(result => {
                res.status(200).json(result)
            }).catch(error => {
            res.status(400).json(error)
        })
    })

    app.get('/user-description/:id', cors(corsOptions), authenticateToken, (req, res) => {
        mentorDescriptionService.getDescription(req.params.id)
            .then(result => {
                res.status(200).json(result)
            }).catch(error => {
            res.status(400).json(error)
        })
    })

    app.post('/user-description/', cors(corsOptions), authenticateToken, (req, res) => {
        const user = getAuthenticationInfo(req.headers.authorization.split(' ')[1])
        console.log(user)
        mentorDescriptionService.addDescription({
            id: user.userId,
            ...req.body
        })
            .then(result => {
                res.status(200).json({message: 'Description created'})
            }).catch(error => {
            res.status(400).json({message: 'Bad request'})
        })
    })

    app.put('/user-description', cors(corsOptions), authenticateToken, (req, res) => {
        mentorDescriptionService.updateDescription(req.body)
            .then(result => {
                res.status(200).json({message: 'Description updated'})
            }).catch(error => {
            res.status(400).json({message: 'Bad request'})
        })
    })
}