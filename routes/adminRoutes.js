// adminRoutes.js
const express = require('express');
const adminController = require('./../controllers/adminController');
const authController = require('./../controllers/authController');
const paginateLeaveRequests = require('./../util/paginateLeaveRequests');

const router = express.Router();

router.use(authController.protect);
router.get('/dashboard', authController.restrictTo('admin'), adminController.dashboard);
router.get('/logout', authController.postLogout);
router.get('/adminProfile', adminController.showProfile);
// Route for fetching leave requests with pagination
router.get('/leaveRequests', authController.restrictTo('admin'), async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2; // Adjusted limit to 2

        // Call paginateLeaveRequests function to fetch paginated leave requests
        const { leaves, currentPage, totalPages } = await paginateLeaveRequests(page, limit);

        // Render the view with the paginated data
        res.render('adminLeaveRequests', {
            leaves,
            currentPage,
            totalPages,
            limit: limit
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/userInfo', adminController.userInfo);

module.exports = router;
