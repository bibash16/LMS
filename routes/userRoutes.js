const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const router = express.Router();

// Routes for user authentication
router.get('/registration', authController.getSignUp);
router.post('/postSignUp', authController.postSignUp);
router.get('/login', authController.getLogin);
router.post('/postLogin', authController.postLogin);
router.post('/logout', authController.postLogout); // Assuming this route is for logging out

// Routes for user dashboard and leave-related actions
router.get('/dashboard', userController.dashboard);
router.post('/postLeaveApplication', userController.postLeaveApplication);
router.get('/leave-request', userController.getLeaveApplication);
router.get('/get-user-info', authController.protect, userController.getUserInfo); // Protected route for getting user info

//Route to fetch all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find(); // Retrieve all users from the database
        res.render('userList', { users }); // Render the userList EJS template with users data
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Server Error');
    }
});
module.exports = router;
