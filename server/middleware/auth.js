const dotenv = require("dotenv");
dotenv.config();
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const auth = (req,res,next) => {
    try {

        const token = req.header("Authorization")
        
        const user = jwt.verify(token,process.env.JWT_SECRET);

        userModel.findByPk(user.userId).then((user)=>{
            req.user = user;
            next();
        });

    }catch(err){
     console.log("Error during auth : ",err);
     return res.status(409).json({success:false});
    }
}

module.exports = auth;