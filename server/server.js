const dotenv = require("dotenv");
dotenv.config();
const userRouter = require("./routes/userRoutes");
const cors = require("cors");



const express = require("express");

const db = require("./utils/database");

const app = express();

app.use(express.json());

app.use(express.static("client"));

app.use(cors());

app.use("/user",userRouter);

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