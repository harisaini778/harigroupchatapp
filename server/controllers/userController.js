const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");

const generateAccessToken = (id, email) => {
    return jwt.sign({ userId: id, email: email }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

//console.log("Process env JWT_SECRET : ",process.env.JWT_SECRET);

const postUserLogin = async (req,res) =>{
      
try {

    const {email,password} = req.body;

    const user = await Users.findOne({where : {email:email}});

    if(!user) {

        return res.status(403).send({message:'User does not exists'});

    }

    const passwordCompare  = await bcrypt.compare(password,user.password);

    if(!passwordCompare) {
        return res.status(403).send({message:'Invalid Password!'});
    }

    const token = generateAccessToken(user.id,user.email);

    console.log("JWT token is : ",token);

    return res.status(200).json({message : "Login Sucessful", userId : user.id,email : email,token :token});

}catch(err){
    console.log("Err during login server : ", err);
}
}

const postUserSignUp = async (req,res) =>{

    try {
    
      console.log("req.body is ",req.body);

       const {username,email,password} = req.body;

       const existingUser =  await Users.findOne({where : {email:email}});

       if(existingUser) {
        return res.status(409).json({message : "Email already exists, please try login directly!"})
       }

       const hashPassword = await bcrypt.hash(password,12);

       const insertToDb = await Users.create({
        name : username,
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