const User = require('./../models/userModel');
const Leave = require('./../models/leaveModel');
const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/appError');
const path = require('path');

exports.dashboard = catchAsync(async(req,res,next)=>{
  res.sendFile(path.join(__dirname,'..','public','html','dashboard.html'));
});

exports.getUserInfo = catchAsync(async(req, res) => {
    const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
  
  // Send the file as a separate response
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'dashboard.html'));
});


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
exports.getLeaveApplication = (req, res, next) => {
  res.sendFile(path.join(__dirname,'..','public','html','leaveForm.html'));
};
exports.postLeaveApplication = async (req,res,next) => {
  const newLeave = await Leave.create({
    name: req.body.name,
    email: req.body.email,
    startDate: req.body.startdate,
    endDate: req.body.enddate,
    leaveType: req.body.leavetype,
    description: req.body.description,
  });
  res.status(201).redirect('/api/v1/user/dashboard');
};
