const dotenv = require("dotenv");
dotenv.config();
const userRouter = require("./routes/userRoutes");
const chatRouter = require("./controllers/chatController");
const userModel = require("./models/userModel");
const chatModel = require("./models/chatModel");
const cors = require("cors");



const express = require("express");

const db = require("./utils/database");

const app = express();

app.use(express.json());

app.use(express.static("client"));

app.use(cors());


userModel.hasMany(chatModel,{onDelete :"CASCADE",hooks:true});
chatModel.belongsTo(userModel);

app.use("/user",userRouter);

app.use("/homepage",chatRouter);

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