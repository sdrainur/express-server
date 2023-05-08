const corsOptions = require('../middlewares/cors.config')
const cors = require('cors')
const {authenticateToken} = require("../middlewares/jwt.middleware");
const feedbackService = require('../service/feedback.service')
const {getAuthenticationInfo} = require("../service/auth.service");

module.exports = app => {
    app.post('add-feedback', cors(corsOptions), authenticateToken, (req, res)=>{
        if(feedbackService.addFeedback({
            mentorId: req.body.mentorId,
            authorId: getAuthenticationInfo(req.headers.authorization.split(' ')[1]).userId,
            score: req.body.score,
            text: req.body.text
        })){
            res.status(200)
        } else {
            res.status(400)
        }
    })
}