const Leave = require('./../models/leaveModel');

const paginateusermodel = async (page, limit) => {
    try {
        const leaves = await Leave.find({})
            .skip((page - 1) * limit)
            .limit(limit);

        const totalLeaves = await Leave.countDocuments({});
        const totalPages = Math.ceil(totalLeaves / limit);

        return { leaves, currentPage: page, totalPages };
    } catch (error) {
        // Handle any errors that occur during the database query
        console.error("Error paginating leave records:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
};

module.exports = paginateusermodel;
