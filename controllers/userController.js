const User = require('./../models/userModel');
const Leave = require('./../models/leaveModel');
const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/appError');
const path = require('path');

exports.dashboard = catchAsync(async(req,res,next)=>{
  //console.log(req.user);
  res.render(path.join(__dirname,'..','public','html','userHTML','dashboard.ejs'), {user : req.user})
});

exports.showProfile = catchAsync(async(req,res,next)=>{
  res.render(path.join(__dirname,'..','public','html','userHTML','userProfile.ejs'), {user : req.user})
});

exports.updateProfile = catchAsync(async(req,res,next)=>{
  
  res.render(path.join(__dirname,'..','public','html','userHTML','updateProfile.ejs'), {user : req.user})
});

exports.postUpdateProfile = async (req, res, next) => {
   try {
    // Access the logged-in user ID from the middleware
    const userId = req.user._id;

    // Extract update data from the request body
    const { name, email, contact, position } = req.body;

    // Update user document 
    const updatedUser = await User.findByIdAndUpdate(userId, {
      name,
      email,
      contact,
      position
    }, { new: true }); // Return the updated document

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    //redirect after everything is done
    res.status(201).redirect('/api/v1/user/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating user information' });
  }
};


exports.leaveRequests = async (req, res, next) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized: User ID not found.'
    });
  }
  try {
    const leaveRecords = await Leave.find({ userId })
      .populate('userId','-password -role'); 
     res.render(path.join(__dirname,'..','public','html','userHTML','leaveRequests.ejs'), { leaveRecords });
    }
   catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error'
    });
}};
exports.leaveRemaining = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
exports.getLeaveApplication = (req, res, next) => {
  const user = req.user;
  res.render(path.join(__dirname,'..','public','html','userHTML','leaveForm.ejs'),{ user });
};
exports.postLeaveApplication = async (req,res,next) => {
  const userId = req.user._id;
  const newLeave = await Leave.create({
    userId,
    name: req.body.name,
    email: req.body.email,
    startDate: req.body.startdate,
    endDate: req.body.enddate,
    leaveType: req.body.leavetype,
    description: req.body.description,
  });
  res.status(201).redirect('/api/v1/user/dashboard');
};
