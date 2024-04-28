const path = require('path');
const catchAsync = require('./../util/catchAsync');
const User = require('../models/userModel');
const Leave = require('./../models/leaveModel');
const userInfos = require('../util/userInfos');
const mongoosePaginate = require('mongoose-paginate');
const paginateAdminLeaves = require('../util/paginateAdminLeaves');
const EmailService = require('./../util/email');

const emailService = new EmailService();


exports.dashboard = async (req, res, next) => {
    try {
        res.render(path.join(__dirname, '..', 'public', 'html', 'adminHTML', 'adminDashboard.ejs'), { user: req.user });
    } catch (err) {
        res.status(500).render(path.join(__dirname, '..', 'public', 'html', '500.ejs'));
    }
};

exports.showProfile = catchAsync(async (req, res, next) => {
    res.render(path.join(__dirname, '..', 'public', 'html', 'adminHTML', 'adminProfile.ejs'), { user: req.user });
});

exports.userInfo = catchAsync(async (req, res, next) => {
    //const users = await User.find({});
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
    
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
         res.status(500).render(path.join(__dirname, '..', 'public', 'html', '500.ejs'));
    }
});


exports.acceptLeave = async (req, res, next) => {
    try {
        const leaveId = req.body.leaveId; 

        if (!leaveId) {
            req.flash('error', { statusCode: 400, message:'Invalid Leave Request'}); 
            return res.redirect('/api/v1/admin/leaveRequests');
        }

        const leave = await Leave.findByIdAndUpdate(leaveId, { status: 'Accepted' }, { new: true }); // Update and return updated doc
        if (!leave) {
            req.flash('error', { statusCode: 400, message:'Leave Request not found.'}); 
            return res.redirect('/api/v1/admin/leaveRequests');
        }

        // Calculate leave duration
        const leaveDuration = leave.leaveDuration;

        // Update user's remainingLeave and leaveTaken fields
        const user = await User.findById(leave.userId);
        if (!user) {
            req.flash('error', { statusCode: 404, message:'User not found.'}); 
            return res.redirect('/api/v1/admin/leaveRequests');
        }

        // Update remainingLeave and leaveTaken based on leave type
        switch (leave.leaveType) {
            case 'Casual':
                user.remainingLeave.Casual -= leaveDuration;
                user.leaveTaken.Casual += leaveDuration;
                break;
            case 'Sick':
                user.remainingLeave.Sick -= leaveDuration;
                user.leaveTaken.Sick += leaveDuration;
                break;
            case 'Maternity':
                user.remainingLeave.Maternity -= leaveDuration;
                user.leaveTaken.Maternity += leaveDuration;
                break;
            case 'Paternity':
                user.remainingLeave.Paternity -= leaveDuration;
                user.leaveTaken.Paternity += leaveDuration;
                break;
            case 'Wedding':
                user.remainingLeave.Wedding -= leaveDuration;
                user.leaveTaken.Wedding += leaveDuration;
                break;
            case 'Bereavement':
                user.remainingLeave.Bereavement -= leaveDuration;
                user.leaveTaken.Bereavement += leaveDuration;
                break;
            default:
                req.flash('error', { statusCode: 404, message:'Leave Type Not Valid.'}); 
                return res.redirect('/api/v1/admin/leaveRequests');
        }

        await user.save();

        await emailService.sendAcceptLeaveEmail(user, leaveId);

        req.flash('success', 'Leave application updated!');
        res.status(201).redirect('/api/v1/admin/leaveRequests');
    } catch (error) {
        console.error(error);
        return res.status(500).render(path.join(__dirname, '..', 'public', 'html', '500.ejs'));
    }
};

exports.rejectLeave = async (req, res, next) => {
  try {
    const leaveId = req.body.leaveId; 
    

    if (!leaveId) {
        req.flash('error', { statusCode: 400, message:'Invalid Request'}); 
        return res.redirect('/api/v1/admin/leaveRequests');
    }

    const leave = await Leave.findByIdAndUpdate(leaveId, { status: 'Rejected' }, { new: true }); // Update and return updated doc
    if (!leave) {
        req.flash('error', { statusCode: 404, message:'Leave Request Not Found.'}); 
        return res.redirect('/api/v1/admin/leaveRequests');
    }

    const user = await User.findById(leave.userId);

    await emailService.sendRejectLeaveEmail(user, leaveId);

   req.flash('success', 'Leave application updated!');
   res.status(201).redirect('/api/v1/admin/leaveRequests');

  } catch (error) {
    return res.status(500).render(path.join(__dirname, '..', 'public', 'html', '500.ejs'));
    }
};


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
      const limit = parseInt(req.query.limit) || 7;
  
      // Fetch paginated leave requests
      const { leaves, currentPage, totalPages } = await paginateAdminLeaves(page, limit);
  
      // Render the leave requests view with paginated data
      res.render(path.join(__dirname, '..', 'public', 'html', 'adminHTML', 'adminLeaveRequests.ejs'), {
        leaveRecords: leaves, // Change 'leaves' to 'leaveRecords'
        currentPage,
        totalPages,
        limit
      });
    } catch (err) {
      // Handle errors
      console.error(err);
      return res.status(500).render(path.join(__dirname, '..', 'public', 'html', '500.ejs'));
    }
  };
  