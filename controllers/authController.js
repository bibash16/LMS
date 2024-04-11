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

exports.signin = async(req, res, next)=>{
    const email = req.body.email;
    const password = req.body.password;
    if(!email || !password){
        res.json({'Enter':'both'});
    }
    else{
        res.redirect('/api/v1/user/dashboard');   
    }
}