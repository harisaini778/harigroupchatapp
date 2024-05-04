const Chats = require("../models/chatModel");
const Users =  require("../models/userModel");




const sendMessage = async (req,res) => {

    try {
    
        const user = await Users.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

     //console.log("req object : ",req.body,req.user.dataValues);

     console.log("name is : ",req.user.name);

     const chats = await Chats.create({
        message : req.body.message,
        global : true,
        userId : req.user.id,
        userName : req.user.name,
     });
    
    return res.status(200).json({message:"success", chats : chats});

    } catch (err) {
     console.log("err occured while inserting chat into db : ",err);
     return res.status(400).json({message: "failure", errMsg : err});
    }
};


// io.on("connection",(socket)=>{
//     socket.on("getMessages",async()=>{
//         try {
//             const chats =  await Chats.findAll();
//             io.emit("messages", chats)
//         }catch(err) {
//            console.log(err);
//         }
//     })
// });



const sendGroupMessages = async (req,res) => {

 try {

    const {message,global,userId,groupId,name} = req.body;

    const  groupChat = await Chats.create({
        message,
        global,
        userId,
        groupId,
        userName : name,
    });

    return res.status(200).json({groupChat});

 }catch(err) {
     res.status(500).json({message : "Err occured while creating groupChat", errMsg: err});
 }

}


// const getGroupMessages = async (req, res) => {
    
//     const { groupId } = req.params;

//     console.log(groupId + ' is the id of the group');

//     try {
//         const messages = await Chats.findAll({ where: { groupId } });
//         res.status(200).json({ messages });
//     } catch (err) {
//         console.log('Error fetching group messages:', err);
//         res.status(500).json({ message: 'Internal server error' });
//     }
// };

module.exports = {sendMessage,sendGroupMessages};