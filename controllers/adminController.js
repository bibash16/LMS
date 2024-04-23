const path = require('path');
const catchAsync = require('./../util/catchAsync');
const User = require('../models/userModel');
const Leave = require('./../models/leaveModel');
const paginateLeaveRequests = require('../util/paginateLeaveRequests');
const userInfos = require('../util/userInfos');
const mongoosePaginate = require('mongoose-paginate');
const paginateusermodel = require('../util/paginateusermodel');


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
    //const users = await User.find({});
   
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 5;
      
            // Fetch paginated leave requests
            const { userinformation, currentPage, totalPages } = await userInfos(page, limit);
      
            // Render the admin leave requests view with paginated leave requests data
            res.render(path.join(__dirname, '..', 'public', 'html', 'adminHTML', 'adminUserInfo.ejs'), {
                currentPage, // Ensure currentPage is correctly passed
                totalPages,
                limit,
                users: userinformation // Ensure totalPages is correctly passed
            });
        } catch (err) {
            // Handle errors
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
      });
exports.deleteUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not yet defined!'
    });
};

exports.acceptLeave = async (req, res, next) => {
    try {
        const leaveId = req.body.leaveId; 

        if (!leaveId) {
            return res.status(400).json({ message: 'Invalid request' });
        }

        const leave = await Leave.findByIdAndUpdate(leaveId, { status: 'Accepted' }, { new: true }); // Update and return updated doc
        if (!leave) {
            return res.status(404).json({ message: 'Leave request not found' });
        }

        // Calculate leave duration
        const leaveDuration = leave.leaveDuration;

        // Update user's remainingLeave and leaveTaken fields
        const user = await User.findById(leave.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update remainingLeave and leaveTaken based on leave type
        if (leave.leaveType === 'Casual') {
            user.remainingLeave.Casual -= leaveDuration;
            user.leaveTaken.Casual += leaveDuration;
        } else if (leave.leaveType === 'Sick') {
            user.remainingLeave.Sick -= leaveDuration;
            user.leaveTaken.Sick += leaveDuration;
        }

        await user.save();

        res.status(201).redirect('/api/v1/admin/leaveRequests');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error accepting leave request' });
    }
};

exports.rejectLeave = async (req, res, next) => {
  try {
    const leaveId = req.body.leaveId; 

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
};// Modified leaveRequests function with pagination
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
  