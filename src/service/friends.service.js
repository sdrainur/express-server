const db = require('../configs/sequelize.config')
const User = db.user
const UsersFriends = db.usersFriends
const mailService = require('../service/mail.service')
const bcrypt = require('bcrypt')
const {usersFriends} = require("../configs/sequelize.config");

const addFriend = async (user_id, friend_id) => {
    await UsersFriends.create({
        user_id: user_id,
        friend_id: friend_id
    }).catch(error => {
        console.log(error)
    })
    await UsersFriends.create({
        user_id: friend_id,
        friend_id: user_id
    }).catch(error => {
        console.log(error)
    })
}

module.exports = {
    addFriend
}