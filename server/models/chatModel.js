const sequelize = require("../utils/database");
const {DataTypes}  = require("sequelize");
const Users = require("./userModel");
const Groups = require("./groupModel");

const Chats = sequelize.define("chats",{
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey: true,
    },
    message : {
        type : DataTypes.STRING,
        allowNull:false,
    },
    global : {
        type : DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue : true,
    }
});

Chats.belongsTo(Users);
Chats.belongsTo(Groups);

module.exports = Chats;