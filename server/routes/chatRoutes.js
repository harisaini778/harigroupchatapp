const chatController = require("../controllers/chatController");
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const auth = require("../middleware/auth");

const express = require("express");

const router = express.Router();

router.post("/sendMessage",auth,chatController.sendMessage);

router.post("/sendFile",auth,upload.single('file'),chatController.sendFile);

//router.get("/getMessage",chatController.getMessage);

//router.get('/getGroupMessages/:groupId', chatController.getGroupMessages);

router.post("/sendGroupMessages",chatController.sendGroupMessages);

module.exports = router;


