const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.get('/registration', authController.getSignUp);
router.post('/postSignUp', authController.postSignUp);
router.get('/login', authController.getLogin);
router.post('/postLogin', authController.postLogin)

//protects all routes after logging in 
router.use(authController.protect);
router.get('/dashboard', userController.dashboard);
router.post('/postLeaveApplication', userController.postLeaveApplication);
router.get('/leaveRequest', userController.getLeaveApplication);
router.get('/profile', userController.showProfile)
router.get('/logout', authController.postLogout);

module.exports = router;
