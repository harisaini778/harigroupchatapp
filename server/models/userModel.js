const {DataTypes} = require("sequelize");
const sequelize = require("../utils/database");

const Users = sequelize.define("users",{
    id :  {
        type : DataTypes.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey:true,
    },

    name : {
        type : DataTypes.STRING,
        allowNull : false
    },

    email : {
        type : DataTypes.STRING,
        allowNull :  false,
        unique : true,
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false,
    }
});

module.exports = Users;