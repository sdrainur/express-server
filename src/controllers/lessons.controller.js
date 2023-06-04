const cors = require('cors')
const {corsOptions} = require("../middlewares/cors.config");
const {authenticateToken} = require("../middlewares/jwt.middleware");
const LessonsService = require('../service/lessons.service')
const UserService = require('../service/user.service')
const jwtDecode = require("jwt-decode");
const {getAuthenticationInfo} = require("../service/auth.service");

module.exports = app => {
    app.post('/lessons/add-one', cors(corsOptions), authenticateToken, (req, res) => {
        const token = req.headers.authorization.split(' ')[1]
        const data = req.body
        data.userId = jwtDecode(token).id
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
                res.status(200).json(result)
            }).catch(error => {
            res.status(400).json(error)
        })
    })

    app.get('/lesson/plan/', cors(corsOptions), authenticateToken, (req, res) => {
        const user = getAuthenticationInfo(req.headers.authorization.split(' ')[1])
        LessonsService.getLessonsPlan(user.userRole, user.userId)
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

    app.get('/lessons/:year/:month/:date', cors(corsOptions), authenticateToken, (req, res) => {
        const user = getAuthenticationInfo(req.headers.authorization.split(' ')[1])
        LessonsService.getLessonsPlanByDate({
            userId: user.userId,
            userRole: user.userRole,
            startTime: new Date(req.params.year, req.params.month, req.params.date, 0, 0),
            endTime: new Date(req.params.year, req.params.month, req.params.date, 23, 59, 59, 0),
        }).then(result => {
            LessonsService.getLessons({
                userId: user.userId,
                userRole: user.userRole,
                lessonsId: result.map((lesson) => lesson.id)
            }).then(lessonsInfo => {
                res.status(200).json(lessonsInfo)
            }).catch(error => {
                console.log(error)
                res.status(400).json(error)
            })
        }).catch(error => {
            console.log(error)
            res.status(400).json(error)
        })
    })

    app.get('/lessons/has-lesson-now/:id', cors(corsOptions), authenticateToken, (req, res) => {
        const authUser = getAuthenticationInfo(req.headers.authorization.split(' ')[1]);
        const dateNow = Date.now();
        LessonsService.getLessonNow({
            userId: authUser.userId,
            userRole: authUser.userRole,
            remoteId: Number(req.params.id),
            dateNow: dateNow
        }).then(result => {
            console.log(result)
            res.status(200).json({'hasLessonNow': result.length!==0})
        }).catch(error=>{
            console.log(error)
            res.status(200).json({'message': error})
        })
    })

    app.get('/lessons/get-statistic/:mentorId', cors(corsOptions), authenticateToken, (req, res)=>{
        LessonsService.getStatistic(req.params.mentorId)
            .then(result => {
                res.status(200).json(result)
            })
            .catch(error=>{
                res.send(400)
            })
    })
}