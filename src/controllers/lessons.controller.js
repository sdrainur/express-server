const cors = require('cors')
const {corsOptions} = require("../middlewares/cors.config");
const {authenticateToken} = require("../middlewares/jwt.middleware");
const LessonsService = require('../service/lessons.service')
const jwtDecode = require("jwt-decode");

module.exports = app => {
    app.post('/lessons/add-one', cors(corsOptions), authenticateToken, (req, res) => {
        const token = req.headers.authorization.split(' ')[1]
        const data = req.body
        data.userId = jwtDecode(token).id
        console.log(data)
        LessonsService.buyLesson(data)
            .then(result => {
                if (result) {
                    res.status(200).json({message: 'Lesson created'})
                } else {
                    res.status(400).json({error: 'Bad request'})
                }
            }).catch(error => {
            console.log(error)
            res.status(400).json({error: error})
        })
    })

    app.get('/lesson/plan/:role/:id', cors(corsOptions), authenticateToken, (req, res) => {
        LessonsService.getLessonsPlan(req.params.role, req.params.id)
            .then(result => {
                console.log(result)
                res.status(200).json(result)
            }).catch(error => {
            res.status(400).json(error)
        })
    })

    app.post('/lesson/complete', cors(corsOptions), authenticateToken, (req, res) => {
        if (LessonsService.completeLesson(req.body)) {
            res.status(200).json({message: 'Lesson completed'})
        } else {
            res.status(400).json({error: 'Lesson not completed'})
        }
    })
}