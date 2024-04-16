const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.get('/registration', authController.getSignUp);
router.post('/postSignUp', authController.postSignUp);
router.get('/login', authController.getLogin);
router.post('/postLogin', authController.postLogin)
router.get('/dashboard',authController.protect, userController.dashboard);
router.post('/postLeaveApplication', userController.postLeaveApplication);
router.get('/leave-request',authController.protect, userController.getLeaveApplication);
router.post('/logout', authController.postLogout);

router.route('/get-user-info')
    .get(authController.protect, userController.getUserInfo);

module.exports = router;
