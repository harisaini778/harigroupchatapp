const chatModel = require("../models/chatModel");



const sendMessage = async (req,res) => {

    try {
    
     const chatTable = await chatModel.create({
        userId : req.user.id,
        name : req.user.name,
        message : req.body.message
     });
    
    return res.status(200).json({message:"success"});

    } catch (err) {
     console.log("err occured while inserting chat into db : ",err);
     return res.status(400).json({message: "failure", errMsg : err});
    }
}

module.exports = sendMessage;