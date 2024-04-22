const User = require('./../models/userModel');

const userInfos= async (page, limit) => {
    const userinformation = await User.find({})
        .skip((page - 1) * limit)
        .limit(limit);

    const totaluserinformation = await User.countDocuments({});
    const totalPages = Math.ceil(totaluserinformation/ limit);

    return { userinformation, currentPage: page, totalPages };
};

module.exports = userInfos;
