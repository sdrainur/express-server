const db = require('../configs/sequelize.config')
const {v4: uuidv4} = require('uuid');
const {raw} = require("express");
const {decodeJwt} = require("./auth.service");
const ChatRoom = db.ChatRoom
const Message = db.Message

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
    const chatRoomFromDb = await findChatRoom(userId, mentorId);
    if (chatRoomFromDb === null) {
        await ChatRoom.create({
            uuid: uuidv4(),
            userId: userId,
            mentorId: mentorId
        })
    }
}

const postTextMessage = async (chatRoomUuid, messageText, senderId) => {
    const chatRoom = ChatRoom.findOne({
        where: {
            uuid: chatRoomUuid
        }
    })
    if (chatRoom !== null) {
        const message = new Message({
            chatRoom: chatRoomUuid,
            text: messageText,
            sender: senderId
        })
        await message.save()
        return message.dataValues
    }
}
const getMessages = async (chatRoomUuid) => {
    return await Message.findAll({
        where: {
            chatRoom: chatRoomUuid
        }
    }, {
        raw: true
    })
}

module.exports = {
    findChatRoom,
    createChatRoom,
    findChatRoomByUserId,
    postTextMessage,
    getMessages,
}