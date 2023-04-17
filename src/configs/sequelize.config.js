const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'meachapp',
    'postgres',
    'qwerty',
    {
        dialect: "postgres",
        host: "localhost",
        port: 5433
    });
const User = require('../models/user.model')(sequelize);
const UsersFriends = require('../models/usersFriends.model')(sequelize);
const Category = require('../models/category.model')(sequelize);
const UsersCategories = require('../models/usersCategories.model')(sequelize);
const FriendsRequests = require('../models/friendsRequests.model')(sequelize);
const AvailableLessons = require('../models/availableLessons.model')(sequelize);
const CompletedLessons = require('../models/completedLesons.model')(sequelize);
const MentorDescription = require('../models/mentorDescription.model')(sequelize);
const LessonsPlan = require('../models/lessonsPlan.model')(sequelize);
const ChatRoom = require('../models/chatRoom.model')(sequelize)
const Message = require('../models/message.model')(sequelize)

sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch((error) => {
    console.error('Unable to connect to the database: ', error);
});

User.belongsToMany(User, {
    as: 'friends',
    foreignKey: 'user_id',
    through: UsersFriends
});

User.belongsToMany(User, {
    as: 'userFriends',
    foreignKey: 'friend_id',
    through: UsersFriends
});

Category.belongsToMany(User, {
    as: 'usersCategories',
    foreignKey: 'category_id',
    through: UsersCategories,
})

User.belongsToMany(Category, {
    as: 'usersCategories',
    foreignKey: 'user_id',
    through: UsersCategories,
})

User.belongsToMany(User, {
    as: 'userAvailableLesson',
    foreignKey: 'user_id',
    through: AvailableLessons
})

User.belongsToMany(User, {
    as: 'mentorAvailableLesson',
    foreignKey: 'mentor_id',
    through: AvailableLessons
})

User.belongsToMany(User, {
    as: 'userCompletedLesson',
    foreignKey: 'userId',
    through: CompletedLessons
})

User.belongsToMany(User, {
    as: 'mentorCompletedLesson',
    foreignKey: 'mentorId',
    through: CompletedLessons
})

User.belongsToMany(User, {
    as: 'sender',
    foreignKey: 'sender_id',
    through: FriendsRequests
});

User.belongsToMany(User, {
    as: 'receiver',
    foreignKey: 'receiver_id',
    through: FriendsRequests
});

User.hasOne(MentorDescription, {
    as: 'mentorDescription',
    foreignKey: 'mentorId'
})

User.hasMany(LessonsPlan, {
    as: 'userLessonsPlan',
    foreignKey: 'userId',
})

User.hasMany(LessonsPlan, {
    as: 'mentorLessonsPlan',
    foreignKey: 'mentorId',
})

User.hasMany(ChatRoom, {
    as: 'userChatRoom',
    foreignKey: 'userId'
})

User.hasMany(ChatRoom, {
    as: 'mentorChatRoom',
    foreignKey: 'mentorId'
})

ChatRoom.hasMany(Message, {
    as: 'chatRoomMessage',
    foreignKey: 'chatRoom'
})

sequelize.sync().catch((error) => {
    console.error('Unable to create table : ', error);
});


module.exports = {
    sequelize,
    User,
    UsersFriends,
    UsersCategories,
    Category,
    FriendsRequests,
    AvailableLessons,
    CompletedLessons,
    MentorDescription,
    LessonsPlan,
    ChatRoom,
    Message
};
