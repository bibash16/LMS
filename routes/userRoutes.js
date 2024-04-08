const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');
const leaveController = require('./../controllers/leavecontroller');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/leaveformrequest', leaveController.leaveSchema);

module.exports = router; 