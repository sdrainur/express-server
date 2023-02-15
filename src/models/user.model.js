const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('user', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            role: {
                type: DataTypes.ENUM(
                    "ADMIN",
                    "USER",
                    "MENTOR"
                ),
                defaultValue: "USER",
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
                validate: {
                    is: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i
                }
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            isBanned: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false
            },
            activationCode: {
                type: DataTypes.INTEGER,
                allowNull: true
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false
            },
            firstName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            secondName: {
                type: DataTypes.STRING,
                allowNull: false
            },
            city: {
                type: DataTypes.STRING,
                allowNull: true
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        }
    )
}

