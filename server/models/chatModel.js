const sequelize = require("../utils/database");
const {DataTypes}  = require("sequelize");


const Chats = sequelize.define("chats",{
    id : {
        type : DataTypes.INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey: true,
    },

    name : {
        type : DataTypes.STRING,
        allowNull:false,
    },

    message : {
        type : DataTypes.STRING,
        allowNull:false,
    },
});

module.exports = Chats;