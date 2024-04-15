const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const router = express.Router();

router.get('/registration', authController.getSignUp);
router.post('/postSignUp', async (req, res) => {
    try {
        // Call the authController.register function to create a new user
        await authController.register(req, res);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});
router.get('/login', authController.getLogin);
router.post('/postLogin', authController.postLogin);
router.get('/dashboard', userController.getDashboard);

router.route('/get-user-info')
    .get(authController.protect, userController.getUserInfo);

router.get('/users', userController.getAllUsers);

module.exports = router;
