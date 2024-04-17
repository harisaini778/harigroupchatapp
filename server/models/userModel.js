const {DataTypes} = require("sequelize");
const sequelize = require("../utils/database");

const userModel = sequelize.define("User",{
    id :  {
        type : DataTypes.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey:true,
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

module.exports = userModel;