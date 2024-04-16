const express = require('express');
const adminController = require('./../controllers/adminController');
const authController = require('./../controllers/authController');

const router = express.Router();

// Protect and restrict access to the dashboard route using authController middleware
router.get('/dashboard', authController.protect, authController.restrictTo('admin'), adminController.dashboard);

// Logout route
router.post('/logout', authController.postLogout);

// Route to get all user info (protected and restricted to admins)
router.get('/get-all-user-info', authController.protect, authController.restrictTo('admin'), adminController.getAllUsers);

module.exports = router;
