const chatController = require("../controllers/chatController");

const auth = require("../middleware/auth");

const express = require("express");

const router = express.Router();

router.post("/sendMessage",auth,chatController.sendMessage);

router.get("/getMessage",chatController.getMessage);

module.exports = router;

