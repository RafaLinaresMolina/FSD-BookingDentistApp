const router = require('express').Router();
const {register, login, logout, getUserData} = require('../controllers/authController');
const auth = require("../middleware/auth")
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/user", auth.loggedRequired, getUserData)

module.exports = router;