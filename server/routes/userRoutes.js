const express =  require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/login",userController.postUserLogin);

router.post("/signup",userController.postUserSignUp);

router.get("/getAllUsers",userController.getAllUsers);



module.exports = router;