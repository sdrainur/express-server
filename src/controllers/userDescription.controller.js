const cors = require('cors')
const {corsOptions} = require("../middlewares/cors.config");
const {authenticateToken} = require("../middlewares/jwt.middleware");
const mentorDescriptionService = require("../service/mentorDescription.service")
const {getAuthenticationInfo} = require("../service/auth.service");
const multer = require('multer')
const {UserDescription} = require("../configs/sequelize.config");
const storage = multer.diskStorage({
destination: function (req, file, callback) {
    callback(null, './uploads/profile-photos');
},
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
})
const upload = multer({storage: storage}).single('file');
const path = require('path')

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

    app.post('/profile-photo', cors(corsOptions), authenticateToken, (req, res, next) => {
        upload(req, res, function (err) {
            if (err) {
                console.log(err)
            } else {
                const user = getAuthenticationInfo(req.headers.authorization.split(' ')[1])
                const fileName = req.file.filename;
                mentorDescriptionService.updateProfilePhoto(user.userId, fileName)
                    .then(() => res.sendStatus(200))
                    .catch(res.send(400))
            }
        })
    })

    app.get('/profile-photo/:userId', cors(corsOptions), authenticateToken, (req, res, next)=>{
        const options = {
            root: path.join('./uploads/profile-photos')
        }

        mentorDescriptionService.getPhotoFileName(getAuthenticationInfo(req.headers.authorization.split(' ')[1]).userId)
            .then(data=> {
                const fileName = data.profilePhotoName
                // res.sendFile(fileName, options, (err) => {
                //     if (err) {
                //         console.log(err)
                //         next(err);
                //     } else {
                //         console.log('Sent:', fileName);
                //     }
                // });
                res.json({'imageName': fileName}).status(200)
            })
    })
}