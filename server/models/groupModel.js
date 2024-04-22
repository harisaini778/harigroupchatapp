const sequelize = require("../utils/database");

const Users = require("./userModel");

const {DataTypes} = require("sequelize");


const Groups = sequelize.define("groups",{


    id : {

     type : DataTypes.INTEGER,
     allowNull:false,
     primaryKey:true,
     autoIncrement : true,

    },

    name : {
    
        type : DataTypes.STRING,
        allowNull: false,
        unique : true,

    },

});

Groups.belongsToMany(Users,{through : "UserGroup"});

module.exports = Groups;