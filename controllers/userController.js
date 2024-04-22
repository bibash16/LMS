const User = require('./../models/userModel');
const Leave = require('./../models/leaveModel');
const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/appError');
const paginateusermodel = require('../util/paginateusermodel');
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
      req.flash('error', 'User not found!');
      return res.redirect('/api/v1/user/dashboard');
    }
    //redirect after everything is done
    req.flash('success', 'User Profile updated succesfully!');
    res.redirect('/api/v1/user/profile');
  } catch (error) {
    req.flash('error', 'Error updating user information.');
    res.redirect('/api/v1/user/updateProfile');
  }
};

exports.updatePassword = catchAsync(async(req,res,next)=>{
  
  res.render(path.join(__dirname,'..','public','html','userHTML','updatePassword.ejs'), {user : req.user})
});

exports.postUpdatePassword = catchAsync(async(req,res,next)=>{
  try { 
  const userId = req.user._id;
  const { currentPassword, newPassword, confirmPassword } = req.body;
  
  const user = await User.findById(userId);

  if (!user) {
    req.flash('error', 'User not found.'); 
    return res.redirect('/api/v1/user/login');
  }

  //checking if the current password matches
  const isMatch = await user.correctPassword(currentPassword, user.password);
  if (!isMatch) {
    req.flash('error', { statusCode: 400, message:'Current Password is Incorrect'}); 
    return res.redirect('/api/v1/user/updatePassword');
  }

  //checking if the new password and confirm password match
  if (newPassword !== confirmPassword) {
    req.flash('error',{ statusCode: 400, message: 'New password and confirm password do not match!'}); 
    return res.redirect('/api/v1/user/updatePassword');
  }

  //updating the password in db
  user.password = newPassword;
  await user.save();
  req.flash('success', 'User Password updated succesfully!');
  res.status(201).redirect('/api/v1/user/dashboard');

  } catch (error) { 
   req.flash('error',{ statusCode: 400, message: 'Error updating password'}); 
   return res.redirect('/api/v1/user/updatePassword');
  }
});

exports.leaveRequests = async (req, res, next) => {
  try {
    // Check if the user is authenticated
    const userId = req.user._id;
    if (!userId) {
      req.flash('error', 'Unauthorized User!');
      return res.redirect('/api/v1/user/login');
    }
    
    // Parse query parameters for pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;

    // Fetch paginated leave requests
    const { leaves, currentPage, totalPages } = await paginateusermodel(page, limit);

    // Render the leave requests view with paginated data
    res.render(path.join(__dirname, '..', 'public', 'html', 'userHTML', 'leaveRequests.ejs'), {
      leaveRecords: leaves, // Change 'leaves' to 'leaveRecords'
      currentPage,
      totalPages,
      limit
    });
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
};


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
  let newLeave;

  try {
  newLeave = await Leave.create({
    userId,
    name: req.body.name,
    email: req.body.email,
    startDate: req.body.startdate,
    endDate: req.body.enddate,
    leaveType: req.body.leavetype,
    description: req.body.description,
  });

    if (newLeave) {
      req.flash('success', 'Leave application submitted successfully!');
    } else {
      req.flash('error', 'Failed to submit leave application.');
    }
  } catch (error) {
      req.flash('error', 'Failed to submit leave application.');
  }
  res.status(201).redirect('/api/v1/user/dashboard');
};
