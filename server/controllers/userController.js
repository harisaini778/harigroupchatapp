const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const generateAcessToken = (id,email) => {
  jwt.sign({userid : id, email : email},process.env.JWT_SECRET,{expiresIn:"1h"})
};


const postUserLogin = async (req,res) =>{
      
try {


    //console.log("logindata is :",loginData);

}catch(err){
    console.log("Err during login server : ", err);
}
}

const postUserSignUp = async (req,res) =>{

    try {
    
      console.log("req.body is ",req.body);

       const {username,email,password} = req.body;

       const existingUser =  await userModel.findOne({where : {email:email}});

       if(existingUser) {
        return res.status(409).json({message : "Email already exists, please try login directly!"})
       }

       const hashPassword = await bcrypt.hash(password,12);

       const insertToDb = await userModel.create({
        username,
        email,
        password : hashPassword
       })
       
       console.log("sigup data stored in the db is ",insertToDb);

       return res.status(200).json({message : "User has been created successfully! Please Login now."});

    
    }catch(err){
        console.log("Err during signup server : ", err);
       return res.status(500).json({message : "Internal Server Error"})
    }
    }

    module.exports = {postUserLogin,postUserSignUp};