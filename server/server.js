const dotenv = require("dotenv");
dotenv.config();
const userRouter = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
const cors = require("cors");



const express = require("express");

const db = require("./utils/database");

const app = express();

app.use(express.json());

app.use(express.static("client"));

app.use(cors());

const Users = require("./models/userModel");
const Chats = require("./models/chatModel");

Users.hasMany(Chats,{onDelete : "CASCADE", hooks: true});
Chats.belongsTo(Users);


app.use("/user",userRouter);

app.use("/chat",chatRouter);


const PORT = process.env.PORT || 5000;

const connectToDb = async () => {

    try {

        await db.sync();

        console.log("Database synchronised successfully");

        app.listen(PORT, ()=> {
         
            console.log(`Server is running on the ${PORT}`)
        })
    } catch(err) {

        console.log("ERROR IS : ",err);
    }

};

connectToDb();