const express = require("express");

const router = express.Router();

const userGroupController  = require("../controllers/userGroupController");

router.get("/getAllNewMembers/:groupId",userGroupController.getAllNewMembers);

router.get("/getAdminInfo",userGroupController.getAdminInfo);

router.get("/getAllAdminsToAdd/:groupId",userGroupController.getAllAdminsToAdd);

router.post("/addNewUsersToUserGroups",userGroupController.addNewUsersToUserGroups);


module.exports = router;