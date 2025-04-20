const express = require("express");
const { UserController } = require("../controllers/user.controller");
const { Auth } = require("../middlewares/auth.middlewares");

const router = express.Router();

//get requests
router.get("/",[Auth], UserController.getAllUsers);
router.get("/own", [Auth], UserController.getCurrentUser);

router.get("/:userId", [Auth], UserController.getUserDetails);

//post requests
router.post("/login", UserController.loginViaPassword);
router.post("/create", UserController.createNewUser);

//put requests
router.put("/update", [Auth], UserController.editCurrentUser);

module.exports.UserRouter = router;
