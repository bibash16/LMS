const express = require('express');
const userController = require('./../controllers/userController');
const adminController = require('./../controllers/adminController');
const authController = require('./../controllers/authController');

const router = express.Router();


router.use(authController.protect);
router.get('/dashboard', authController.restrictTo('admin'), adminController.dashboard);
router.post('/logout', authController.postLogout);
router.get('/adminProfile', adminController.showProfile)


module.exports = router;