const sequelize = require("../utils/database");
const {DataTypes}  = require("sequelize");


const ArchivedChats = sequelize.define("archivedchats",{
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
    },
    userName : {
        type : DataTypes.STRING,
        allowNull: false,
    },
    type : {
        type : DataTypes.STRING,
        allowNull : false,
        defaultValue : "text"
    }
});



module.exports = ArchivedChats;