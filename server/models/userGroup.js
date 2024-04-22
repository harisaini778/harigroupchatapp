const {DataTypes} = require("sequelize");

const sequelize = require("../utils/database");
const Groups = require("./groupModel");
const Users = require("./userModel");


const UserGroup = sequelize.define("UserGroup",{


    id : {
        type  : DataTypes.INTEGER,
        allowNull: false,
        primaryKey : true,
        autoIncrement : true,
    },

    isAdmin : {
       
        type :  DataTypes.BOOLEAN,
        allowNull : false,
        defaultValue : false,
    }
});

Users.belongsToMany(Groups,{through : UserGroup});
Groups.belongsToMany(Users,{through : UserGroup});

module.exports = UserGroup;