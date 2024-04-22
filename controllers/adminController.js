const path = require('path');
const catchAsync = require('./../util/catchAsync');
const User = require('../models/userModel');
const paginateLeaveRequests = require('../util/paginateLeaveRequests');
const mongoosePaginate = require('mongoose-paginate');

exports.dashboard = catchAsync(async (req, res, next) => {
    try {
        // Render the admin dashboard view with user data
        res.render(path.join(__dirname, '..', 'public', 'html', 'adminHTML', 'adminDashboard.ejs'), { user: req.user });
    } catch (err) {
        // Handle errors
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

exports.showProfile = catchAsync(async (req, res, next) => {
    res.render(path.join(__dirname, '..', 'public', 'html', 'adminHTML', 'adminProfile.ejs'), { user: req.user });
});

exports.userInfo = catchAsync(async (req, res, next) => {
    const users = await User.find({});
    res.render(path.join(__dirname, '..', 'public', 'html', 'adminHTML', 'adminUserInfo.ejs'), {
        user: req.user,
        users: users
    });
});

exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

exports.approveLeave = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

exports.rejectLeave = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

exports.deleteLeave = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};// Modified leaveRequests function with pagination
exports.leaveRequests = catchAsync(async (req, res, next) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 8;

      // Fetch paginated leave requests
      const { leaves, currentPage, totalPages } = await paginateLeaveRequests(page, limit);

      // Render the admin leave requests view with paginated leave requests data
      res.render(path.join(__dirname, '..', 'public', 'html', 'adminHTML', 'adminLeaveRequests.ejs'), {
          leaves,
          currentPage, // Ensure currentPage is correctly passed
          totalPages,
          limit // Ensure totalPages is correctly passed
      });
  } catch (err) {
      // Handle errors
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});