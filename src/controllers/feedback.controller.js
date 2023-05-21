const corsOptions = require('../middlewares/cors.config')
const cors = require('cors')
const {authenticateToken} = require("../middlewares/jwt.middleware");
const feedbackService = require('../service/feedback.service')
const {getAuthenticationInfo} = require("../service/auth.service");

module.exports = app => {
    app.post('/add-feedback', cors(corsOptions), authenticateToken, (req, res) => {
        feedbackService.addFeedback({
            mentorId: req.body.mentorId,
            authorId: getAuthenticationInfo(req.headers.authorization.split(' ')[1]).userId,
            score: req.body.score,
            text: req.body.text
        }).then(
            res.send(200)
        ).catch(
            res.send(400)
        )
    })

    app.get('/feedbacks/:mentorId', cors(corsOptions), authenticateToken, (req, res) => {
        feedbackService.getMentorFeedbacks(req.params.mentorId).then((result => {
            console.log(result)
            res.status(200).json(result)
        })).catch(error => {
            res.status(400).json(error)
        })
    })

    app.delete('/feedback/:feedbackId', cors(corsOptions), authenticateToken, (req, res) => {
        console.log(req.params.feedbackId)
        console.log(getAuthenticationInfo(req.headers.authorization.split(' ')[1]).userId)
        feedbackService.deleteFeedback({
            id: req.params.feedbackId,
            authorId: getAuthenticationInfo(req.headers.authorization.split(' ')[1]).userId
        }).then(res.status(200).json({message: "deleted"}))
    })
}