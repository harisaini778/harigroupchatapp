const dotenv = require("dotenv");
dotenv.config();

const Chats = require("./models/chatModel");

const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");


const userRouter = require("./routes/userRoutes");
const chatRouter = require("./routes/chatRoutes");
const groupRouter = require("./routes/groupRoutes");
const userGroupRouter = require("./routes/userGroupRoutes");


const db = require("./utils/database");

const app = express();

const server = createServer(app);

// Ensure the port is properly set up
const PORT = process.env.PORT || 5000;

// Initialize socket.io
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});


io.on("connection", (socket) => {

  console.log("A user has connected",socket.id);


  // Handle getMessage event
  socket.on("getMessage", async () => {
    try {
      // Your logic to fetch messages from the database
      const messages = await Chats.findAll({where :{global:true}});
      io.emit("messages", messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  });

   // Handle incoming group messages
socket.on("getGroupMessage", async (data) => {
  try {
    console.log("data is :", data);
  
    const groupId = data.groupId;
    const groupName = data.groupName;
  
    console.log("group id is :", groupId);
    console.log("group name is :", groupName);
  
    socket.join(groupName); // Join the room identified by the group name
  
    // Fetch group messages from the database
    const groupmessages = await Chats.findAll({ where: { groupId } });
  
    console.log("groupmessages are : ", groupmessages);
  
    // Emit the group messages to all members in the room (group chat)
    io.to(groupName).emit("groupmessages", groupmessages);
  } catch (err) {
    console.log('Error fetching group messages:', err);
  }
});


  // socket.on("getGroupMessage", async (groupId) => {
  //   try {
  //     console.log("group id is :", groupId);
  //     socket.join(groupId);
  //     const groupmessages = await Chats.findAll({ where: { groupId } });
  //     console.log("groupmessages are : ", groupmessages);
  //     socket.broadcast.to(groupId).emit("groupmessages", groupmessages); // Broadcast to all clients in the group except sender
  //   } catch (err) {
  //     console.log('Error fetching or sending group messages:', err);
  //     socket.emit("groupMessageError", { error: "Error fetching or sending group messages" }); // Emit an error event
  //   }
  // });

  // Handle disconnect event
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

});




// io.on("connection", (socket) => {
//   console.log("A user has connected");
//   console.log("User ID is:", socket.id);

//   socket.on("send_message", async (messageData) => {
//     try {
    
//       console.log("Message has been sent successfully!", messageData.data);

//       // Broadcast the new message to all connected clients
//       io.emit("new_message", messageData.data);
//     } catch (err) {
//       console.log("Error while sending the message:", err);
//     }
//   });
// });




// Middleware
app.use(express.json());
app.use(express.static("client"));
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true,
}));

// Routes
app.use("/user", userRouter);
app.use("/chat", chatRouter);
app.use("/groups", groupRouter);
app.use("/userGroups", userGroupRouter);

// Database connection and server startup
const connectToDb = async () => {
  try {
    await db.sync();
    console.log("Database synchronized successfully");

    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.log("Error:", err);
  }
};

connectToDb();

module.exports = {io}

