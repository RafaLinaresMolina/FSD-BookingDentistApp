const router = require('express').Router();
const {register, login, logout, getUserData} = require('../controllers/authController');

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/user", getUserData)

module.exports = router;