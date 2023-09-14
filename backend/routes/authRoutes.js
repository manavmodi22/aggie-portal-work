const express = require('express');
const { signin } = require('../controllers/authController');
const router = express.Router();

//auth routes
// /api/signup
router.post('/signup', signup);

//const { signup, signin, signout, requireSignin } = require('../controllers/auth');  
module.exports = router;
