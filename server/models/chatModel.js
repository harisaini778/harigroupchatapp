const sequelize = require("../utils/database");
const {DataTypes}  = require("sequelize");


const chatModel = sequelize.define("chat",{
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
    }
});

module.exports = chatModel;