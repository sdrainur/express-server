const {corsOptions} = require("../middlewares/cors.config");
const cors = require("cors");
const {Category} = require("../configs/sequelize.config");
const {authenticateToken} = require("../middlewares/jwt.middleware");


module.exports = app => {
    app.post('/category', cors(corsOptions), authenticateToken, (req, res)=>{
        Category.create({
            name: req.body.name
        }).then(()=>{
            res.end()
        })
    })

    app.get('/categories', cors(corsOptions), authenticateToken, (req, res)=>{
        Category.findAll({
            attributes: ['id', 'name'],
            raw: true,
        }).then(result=>{
            res.status(200).json(result)
        })
    })
}
