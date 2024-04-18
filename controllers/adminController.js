const User = require('./../models/userModel');
const Leave = require('./../models/leaveModel');
const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/appError');
const path = require('path');

exports.dashboard = catchAsync(async (req, res, next) => {
  try {
    
    // Render the admin dashboard view with user data
    res.render(path.join(__dirname, '..', 'public', 'html', 'adminHTML', 'adminDashboard.ejs'), {user: req.user});
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

exports.showProfile = catchAsync(async(req,res,next)=>{
  const users = await User.find({});
  res.render(path.join(__dirname,'..','public','html','adminHTML','adminProfile.ejs'), {user : req.user})
});

exports.userInfo = catchAsync(async(req,res,next)=>{
  const users = await User.find({});
  res.render(path.join(__dirname,'..','public','html','adminHTML','adminUserInfo.ejs'), {
    user : req.user,
    users: users
  })
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
};
exports.leaveRequests = async (req, res, next) => {
  try {
    // Fetch user data
    const leaves = await Leave.find({});
    
    
    // Render the admin dashboard view with user data
    res.render(path.join(__dirname, '..', 'public', 'html', 'adminHTML', 'adminLeaveRequests.ejs'), {
      leave: req.leave,
      leaves: leaves
    });
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};