// adminRoutes.js
const express = require('express');
const adminController = require('./../controllers/adminController');
const authController = require('./../controllers/authController');
const paginateLeaveRequests = require('./../util/paginateLeaveRequests');

const router = express.Router();

router.use(authController.protect);
router.get('/dashboard', authController.restrictTo('admin'), adminController.dashboard);
router.get('/logout', authController.postLogout);
router.get('/adminProfile', adminController.showProfile);
// Route for fetching leave requests with pagination
router.get('/leaveRequests', authController.restrictTo('admin'), adminController.leaveRequests);

router.get('/userInfo', adminController.userInfo);

module.exports = router;
