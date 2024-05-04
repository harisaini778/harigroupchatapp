const chatController = require("../controllers/chatController");

const auth = require("../middleware/auth");

const express = require("express");

const router = express.Router();

router.post("/sendMessage",auth,chatController.sendMessage);

//router.get("/getMessage",chatController.getMessage);

//router.get('/getGroupMessages/:groupId', chatController.getGroupMessages);

router.post("/sendGroupMessages",chatController.sendGroupMessages);

module.exports = router;


