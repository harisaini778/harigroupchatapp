const express =  require("express");
const userController = require("../controllers/userController");

const router = express.Router();

//router.get("/login",userController.postUserLogin);

router.post("/signup",userController.postUserSignUp);



module.exports = router;