const dotenv = require("dotenv");
dotenv.config();
const {Op} =  require("sequelize");
const AWS = require("aws-sdk");
const Chats = require("../models/chatModel");
const Users =  require("../models/userModel");
const fs = require('fs');



AWS.config.update({
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_USER_SECRET,
    region: process.env.REGION,
  });
  
  const s3 = new AWS.S3();
  
  const uploadToS3 = (fileData, fileName) => {
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      Body: fileData,
    };
  
    return new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          console.error('Error uploading file to S3:', err);
          reject(err);
        } else {
          console.log('File uploaded successfully:', data);
          resolve(data);
        }
      });
    });
  };



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





const sendFile = async (req, res) => {
    try {

        const user = await Users.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

     //console.log("req object : ",req.body,req.user.dataValues);

        console.log("name is : ",req.user.name);

        const file = req.file;

        console.log("file is :",file);

        const fileName = new Date().toISOString() + file.originalname;
        const mimeType = file.mimetype;

        // Read the file data
        //const fileData = fs.readFileSync(file.path);
        const fileData = file.buffer;

        const data = await uploadToS3(fileData, fileName); // Assuming uploadToS3 is defined elsewhere


        if(req.body.groupId) {
            const chats = await Chats.create({
                message: data.Location,
                global: false,
                userId: req.user.id,
                groupId : req.body.groupId,
                userName: req.user.name,
                type: mimeType,
            });
            
           //fs.unlinkSync(file.path);

            return res.status(200).json({ message: "success", chats: chats });
        }
        else{
            const chats = await Chats.create({
                message: data.Location,
                global: true,
                userId: req.user.id,
                userName: req.user.name,
                type: mimeType,
            });

            //fs.unlinkSync(file.path);

            return res.status(200).json({ message: "success", chats: chats });
        }


    } catch (err) {
        console.log("Error occurred while inserting chat into db:", err);
        return res.status(400).json({ message: "failure", errMsg: err });
    }
};

// AWS.config.update({
//   accessKeyId: process.env.IAM_USER_KEY,
//   secretAccessKey: process.env.IAM_USER_SECRET,
//   region: process.env.REGION,
// });

// const s3 = new AWS.S3();

// const uploadToS3 = (fileData, fileName) => {
//   const params = {
//     Bucket: process.env.BUCKET_NAME,
//     Key: fileName,
//     Body: fileData,
//   };

//   return new Promise((resolve, reject) => {
//     s3.upload(params, (err, data) => {
//       if (err) {
//         console.error('Error uploading file to S3:', err);
//         reject(err);
//       } else {
//         console.log('File uploaded successfully:', data.Location);
//         resolve(data);
//       }
//     });
//   });
// };

// const sendFile = async (req, res) => {
//   try {
//     const file = req.file;

//     const fileName = new Date().toISOString() + file.originalname;
//     const mimeType = file.mimetype;

//     // Read the file data asynchronously
//     const fileData = await fs.promises.readFile(file.path);

//     const data = await uploadToS3(fileData, fileName);

//     // Delete the temporary file after upload
//     await fs.promises.unlink(file.path);

//     const chats = await Chats.create({
//       message: data.Location,
//       global: true,
//       userId: req.user.id,
//       userName: req.user.name,
//       type: mimeType,
//     });

//     return res.status(200).json({ message: 'success', chats: chats });
//   } catch (err) {
//     console.error('Error occurred while inserting chat into db:', err);
//     return res.status(400).json({ message: 'failure', errMsg: err });
//   }
// };



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

module.exports = {sendMessage,sendGroupMessages,sendFile};