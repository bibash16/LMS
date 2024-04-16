const express = require('express');
const userController = require('./../controllers/userController');
const adminController = require('./../controllers/adminController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.get('/dashboard', adminController.dashboard);
router.post('/logout', authController.postLogout);


router.route('/get-all-user-info')
    .get(authController.protect,authController.restrictTo('admin'), adminController.getAllUsers);


module.exports = router;