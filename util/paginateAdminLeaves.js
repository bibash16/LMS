const Leave = require('../models/leaveModel');

const paginateAdminLeaves = async (page, limit) => {
    try {
        const totalLeaves = await Leave.countDocuments({});
        const totalPages = Math.ceil(totalLeaves / limit);

        // Calculate the skip value to reverse the order
        const skip = totalLeaves - (page * limit);

        const leaves = await Leave.find({})
            .skip(skip < 0 ? 0 : skip) // Ensure skip is not negative
            .limit(limit)
            .sort({ createdAt: -1 }); // Sort by createdAt field in descending order

        return { leaves, currentPage: page, totalPages };
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error("Error paginating leave records:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

module.exports = paginateAdminLeaves;
