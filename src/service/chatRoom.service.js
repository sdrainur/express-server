const db = require('../configs/sequelize.config')
const {v4: uuidv4} = require('uuid');
const {raw} = require("express");
const ChatRoom = db.ChatRoom

const findChatRoom = async (userId, mentorId) => {
    return await ChatRoom.findOne({
        where: {
            userId: userId,
            mentorId: mentorId
        }
    })
}

const findChatRoomByUserId = async (userId) => {
    return await ChatRoom.findAll({
        where: {
            userId: userId
        },
        raw: true
    })
}

const createChatRoom = async (userId, mentorId) => {
    console.log('createdchatroom')
    const chatRoomFromDb = await findChatRoom(userId, mentorId);
    console.log(chatRoomFromDb)
    if (chatRoomFromDb === null) {
        await ChatRoom.create({
            uuid: uuidv4(),
            userId: userId,
            mentorId: mentorId
        })
    }
}

module.exports = {
    findChatRoom,
    createChatRoom,
    findChatRoomByUserId
}