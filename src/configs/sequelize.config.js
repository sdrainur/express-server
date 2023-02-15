const Sequelize = require('sequelize');
const sequelize = new Sequelize(
    'meachapp',
    'postgres',
    'qwerty',
    {
        dialect: "postgres",
        host: "localhost"
    });
const User = require('../models/user.model')(sequelize);
const UsersFriends = require('../models/usersFriends.model')(sequelize);
const Category = require('../models/category.model')(sequelize);
const UsersCategories = require('../models/usersCategories.model')(sequelize);
const FriendsRequests = require('../models/friendsRequests.model')(sequelize);

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

Category.belongsToMany(User,{
    as: 'usersCategories',
    foreignKey: 'category_id',
    through: UsersCategories,
})

User.belongsToMany(Category,{
    as: 'usersCategories',
    foreignKey: 'user_id',
    through: UsersCategories,
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


sequelize.sync().catch((error) => {

    console.error('Unable to create table : ', error);
});

module.exports = {
    sequelize: sequelize,
    user: User,
    usersFriends: UsersFriends,
    usersCategories: UsersCategories,
    category: Category,
    friendsRequests: FriendsRequests
};
