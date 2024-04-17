const dotenv = require("dotenv");
dotenv.config();


const {Sequelize} = require("sequelize");

//console.log("Process env : ",process.env);


const sequelize = new Sequelize(
process.env.DATABASE_NAME,
process.env.USERNAME_DB,
process.env.PASSWORD,
 {
    host : process.env.HOST,
    dialect : process.env.DIALECT,
 }

);

module.exports = sequelize;


