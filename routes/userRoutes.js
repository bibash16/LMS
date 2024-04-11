const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.get('/getSignup', authController.getsignup);
router.post('/postSignup', authController.postsignup);
router.use('/getLogin', authController.getLogin);
router.post('/postLogin', authController.postLogin)
router.post('/dashboard', userController.getUserInfo);

router.route('/get-user-info')
    .get(authController.protect, userController.getUserInfo);

module.exports = router;