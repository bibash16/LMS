const express = require('express');
const userController = require('./../controllers/userController');
const adminController = require('./../controllers/adminController');
const authController = require('./../controllers/authController');

const router = express.Router();


router.route('/get-user-info').get(authController.protect, adminController.getAllUsers);



module.exports = router;