const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.post('/signup', authController.signup);
router.get('/login', authController.login);
router.post('/dashboard', userController.getUserInfo);

router.route('/get-user-info')
    .get(authController.protect, userController.getUserInfo);

module.exports = router;