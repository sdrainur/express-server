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

sequelize.sync().catch((error) => {

    console.error('Unable to create table : ', error);
});

module.exports = {
    sequelize: sequelize,
    user: User,
    usersFriends: UsersFriends
};
