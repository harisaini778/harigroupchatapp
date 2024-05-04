const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Users = require("../models/userModel");
const {Sequelize}  = require("sequelize");
const {Op} = require("sequelize");

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

    return res.status(200).json({message : "Login Sucessful", userId : user.id,email : email,token :token, userName:user.name});

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

    const getAllUsers = async (req,res) => {

      try{

        const users = await Users.findAll();
        return res.status(200).json({users : users});

      }catch (err) {
        console.log("err while fetching the users frm the db : ",err);
        return res.status(500).json({errMsg : err},{message : "Some  error occured , please try again later!"})
      }

    }

    const getUserById = async (req, res) => {
        try {
            const { userId } = req.params;
            const user = await Users.findByPk(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            return res.status(200).json({ user });
        } catch (err) {
            console.log('Error fetching user details:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };


    const getUsersByUserIds = async (userIds) => {

        try {
           
            if (!Array.isArray(userIds)) {
                throw new Error("User IDs must be an array");
            }
            
            console.log("In the controller getUsersByUserIds fn :  ",userIds);

            let userArr = [];

            await Promise.all(userIds.map(async (id) => {
                try {
                    const userDetails = await Users.findByPk(id);
    
                    if (userDetails) {
                        userArr.push(userDetails);
                    }
    
                } catch (err) {
                    console.log("Err is:", err);
                }
            }));
    

           const allUsers = userArr.map((user)=>user.name);

            console.log("All users are : ",allUsers);
    
            return allUsers;
    
        } catch(err) {
            console.error("Error getting users by ids",err);
        }
            
    
    }

    module.exports = {postUserLogin,postUserSignUp,getAllUsers,getUserById,getUsersByUserIds};