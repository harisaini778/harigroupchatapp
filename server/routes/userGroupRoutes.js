const express = require("express");

const router = express.Router();

const userGroupController  = require("../controllers/userGroupController");

router.get("/getAllNewMembers/:groupId",userGroupController.getAllNewMembers);


module.exports = router;