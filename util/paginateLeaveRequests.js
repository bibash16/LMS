const Leave = require('./../models/leaveModel');

const paginateLeaveRequests = async (page, limit) => {
    const leaves = await Leave.find({})
        .skip((page - 1) * limit)
        .limit(limit);

    const totalLeaves = await Leave.countDocuments({});
    const totalPages = Math.ceil(totalLeaves / limit);

    return { leaves, currentPage: page, totalPages };
};

module.exports = paginateLeaveRequests;
