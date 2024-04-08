const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const AppError = require('./../util/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = async(req,res,next) => {
    try {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm   
    });

    const token = signToken(newUser._id);

    res.status(201).json({
        status: 'Success',
        token,
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

exports.login = async (req,res,next) => {
    const { email, password } = req.body;

    try {
    
    //checking if the email and password exists
    if (!email || !password) {
      return  next(new AppError('Please provide email and password!', 400));
    }

    //check if user exists and password is  correct
    const user = await User.findOne({ email }).select('+password');

    if(!user || !(await user.correctPassword(password, user.password))) {
        return  next(new AppError('Incorrect email and password!', 401)); 
    }

     // send token after everything is done
    const token = signToken(user._id); 
    res.status(200).json({
        status: 'success',
        token
    });
    } catch (err) { 
        res.status(404).json({
            status: 'Fail',
            message: err
        });
    }
};