const db = require('../configs/sequelize.config')
const UsersFriends = db.usersFriends
const {usersFriends} = require("../configs/sequelize.config");
const FriendsRequests = db.friendsRequests

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

const sendRequest = async (sender_id, receiver_id) => {
    await FriendsRequests.create({
        sender_id: sender_id,
        receiver_id: receiver_id
    }).catch(error => {
        console.log(error)
    })
}

const acceptRequest = async (sender_id, receiver_id) => {
    FriendsRequests.findOne({
        where: {
            sender_id: sender_id,
            receiver_id: receiver_id
        }
    }).then(result => {
        addFriend(result.dataValues.sender_id, result.dataValues.receiver_id)
        FriendsRequests.destroy({
            where: {
                sender_id: sender_id,
                receiver_id: receiver_id
            }
        })
    })
}

const getFriends = async (user_id) => {
    const friends = await usersFriends.findAll({
        where:{
            user_id:user_id
        },
        raw: true
    })
    return friends
}

module.exports = {
    // addFriend
    sendRequest,
    acceptRequest,
    getFriends
}