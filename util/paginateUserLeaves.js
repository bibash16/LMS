const Leave = require('../models/leaveModel');
const User = require('./../models/userModel');


const paginateUserLeaves = async (page, limit, userId) => {
    try {
        const totalLeaves = await Leave.countDocuments({ userId });
       // console.log("Total Leaves:", totalLeaves);
        const totalPages = Math.ceil(totalLeaves / limit);

        // Calculate the skip value to reverse the order
       const skip = (page - 1) * limit;

        const leaves = await Leave.find({userId})
            .sort({ createdAt: -1 })
            .skip(skip)
          //  .skip(skip < 0 ? 0 : skip) // Ensure skip is not negative
            .limit(limit); // Sort by createdAt field in descending order
        return { leaves, currentPage: page, totalPages };
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error("Error paginating leave records:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

module.exports = paginateUserLeaves;
