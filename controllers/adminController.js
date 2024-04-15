const User = require('./../models/userModel');
const Leave = require('./../models/leaveModel');
const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/appError');
const path = require('path');

exports.dashboard = catchAsync(async(req,res,next)=>{
  res.sendFile(path.join(__dirname,'..','public','html','adminDashboard.html'));
});

exports.getAllUsers = async(req, res) => {
  try{ 
    const users = await User.find();
    

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }})
    }catch{
    res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
    })
}};

exports.getUser = (req, res) => {
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
exports.deleteLeave = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.leaveHistory = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};