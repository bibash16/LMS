const User = require('./../models/userModel');
const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/appError');
const path = require('path');

exports.dashboard = catchAsync(async(req,res,next)=>{
  res.sendFile(path.join(__dirname,'..','public','html','dashboard.html'));
});

exports.getUserInfo = catchAsync(async(req, res) => {
    const users = await User.find();

  res.status(200)
  .json({
    status: 'success',
    results: users.length,
    data: {
      users
    }})
    .sendFile(path.join(__dirname,'public', 'html', 'dashboard.html'))
    
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.leaveRemaining = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.leaveApplication = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
