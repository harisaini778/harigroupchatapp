const dotenv = require("dotenv");
dotenv.config();

const {Sequelize} = require("sequelize");

const sequelize = new Sequelize(
process.env.DATABASE_NAME,
process.env.USERNAME,
process.env.PASSWORD,
 {
    host : process.env.HOST,
    dialect : process.env.DIALECT,
 }

);

module.exports = sequelize;


