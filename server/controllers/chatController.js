const Chats = require("../models/chatModel");
const Users =  require("../models/userModel");



const sendMessage = async (req,res) => {

    try {
    
        const user = await Users.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

     console.log("req object : ",req.body,req.user.dataValues);

     await Chats.create({
        message : req.body.message,
        global : true,
        userId : req.user.id,
     });
    
    return res.status(200).json({message:"success"});

    } catch (err) {
     console.log("err occured while inserting chat into db : ",err);
     return res.status(400).json({message: "failure", errMsg : err});
    }
};


const getMessage = async (req,res) => {

    try { 

     const chats =  await Chats.findAll();

     console.log("chats fetched from the db server side : ",chats);

     return res.status(200).json({messages : chats});

    } catch(err) {
     return res.status(404).json({message : "false" ,errMsg : err});
    }

}

const getGroupMessages = async (req, res) => {
    const { groupId } = req.params;

    try {
        const messages = await Chat.findAll({ where: { groupId } });
        res.status(200).json({ messages });
    } catch (err) {
        console.log('Error fetching group messages:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = {sendMessage,getMessage,getGroupMessages};