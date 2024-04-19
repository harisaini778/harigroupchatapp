const chatController = require("../controllers/chatController");

const auth = require("../middleware/auth");

const express = require("express");

const router = express.Router();

router.post("/chat", auth , chatController.sendMessage);

module.exports = router;