const express = require('express');
const router = express.Router();
const { signup, signin, logout, userProfile, verifyCode } = require('../controllers/authController');
const { isAuthenticated } = require('../middleware/auth');


//auth routes
// /api/signup
router.post('/signup', signup);
// /api/verify
router.post('/verify-code', verifyCode);
// /api/signin
router.post('/signin', signin);
// /api/logout
router.get('/logout', logout);
// /api/me
router.get('/me', isAuthenticated, userProfile);

module.exports = router;