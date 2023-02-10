const {DataTypes} = require('sequelize');

module.exports = (sequelize) => {
    return sequelize.define('user', {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
                allowNull: false
            },
            role: {
                type: DataTypes.ENUM(
                    "ADMIN",
                    "MENTOR",
                    "USER"
                ),
                defaultValue: "USER",
                allowNull: false
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    is: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/i
                }
            },
            isActive: {
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
            }
        }
    )
}

