const { reset } = require('nodemon');
const User = require('./../models/userModel');


exports.signup = async(req,res,next) => {
    try {
    const newUser = await User.create(req.body);

    res.status(201).json({
        status: 'Success',
        data: {
        user: newUser
        }
    });
    } catch (err) { 
        res.status(404).json({
            status: 'Fail',
            message: err
        });
    }
};

exports.signin = (req, res, next)=>{
    if(/*Check user credetials*/ true){
        res.redirect('/api/v1/user/dashboard');
    }
    else{
        
    }
}