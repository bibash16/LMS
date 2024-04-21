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
exports.rejectLeave = async (req, res, next) => {
  try {
    const leaveId = req.body.leaveId; // Assuming leave ID is in URL parameter

    if (!leaveId) {
      return res.status(400).json({ message: 'Invalid request' });
    }

    const leave = await Leave.findByIdAndUpdate(leaveId, { status: 'Rejected' }, { new: true }); // Update and return updated doc
    if (!leave) {
      return res.status(404).json({ message: 'Leave request not found' });
    }

    // Optional: Send notification to user about the rejection (see previous explanation)
   res.status(201).redirect('/api/v1/admin/leaveRequests');

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error rejecting leave request' });
  }
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