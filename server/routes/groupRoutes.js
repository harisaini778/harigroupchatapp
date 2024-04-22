const express = require("express");

const router = express.Router();

const groupController = require("../controllers/groupController");

router.post("/createGroup",groupController.createGroup);

router.get("/getAllUsers",groupController.getAllUsers);

module.exports = router;