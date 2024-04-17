const express = require('express');
const adminController = require('./../controllers/adminController');
const authController = require('./../controllers/authController');

const router = express.Router();


router.use(authController.protect);
router.get('/dashboard', authController.restrictTo('admin'), adminController.dashboard);
router.get('/logout', authController.postLogout);
router.get('/adminProfile', adminController.showProfile)
router.get('/leaveRequests', authController.restrictTo('admin'), adminController.leaveRequests);


module.exports = router;
