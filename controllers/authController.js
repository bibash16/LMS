const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/appError');
const path = require('path');



const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.getSignUp = catchAsync(async(req,res,next)=>{
  res.sendFile(path.join(__dirname,'..','public','html','registration.html'));
});

exports.postSignUp = catchAsync(async(req,res,next) => {
    const fullName = req.body.firstname+' '+req.body.lastname;
    const newUser = await User.create({
        
        name: fullName,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        position: req.body.position,
        contactNumber: req.body.contact,
        passwordCreatedAt: req.body.passwordCreatedAt
    });

    const token = signToken(newUser._id);

    res.status(201).redirect('/api/v1/user/login');
});

exports.getLogin = catchAsync(async (req,res,next) => {

    res.sendFile(path.join(__dirname, '..','public', 'html', 'login.html'));
});

exports.postLogin = catchAsync(async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email and password!', 401));
  }

  const token = signToken(user._id);

  // Calculate the expiration date for the JWT cookie
  const expiresIn = process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000; // Convert days to milliseconds
  const expirationDate = new Date(Date.now() + expiresIn);

  // Set the JWT cookie
  res.cookie('jwt', token, {
      expires: expirationDate,
      httpOnly: true,
      secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });

  const redirectUrl = user.role === 'admin' ? '/api/v1/admin/dashboard' : '/api/v1/user/dashboard';
  res.status(200).redirect(redirectUrl);
});

exports.postLogout = catchAsync(async (req,res,next) => {
  res.cookie('jwt', '', { expires: new Date(0), httpOnly: true });

  res.status(200).redirect('/api/user/login');
});

exports.protect = catchAsync(async (req, res, next) => {
  // Get token and check if it's there
  let token;

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // if (
  //   req.headers.authorization &&
  //   req.headers.authorization.startsWith('Bearer')
  // ) {
  //   token = req.headers.authorization.split(' ')[1];
  // }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  //  Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

//restricting routes to ADMIN since signing up defaults to user
exports.restrictTo = (...roles) => {
    return (req,res,next)=> {
        // role: admin
        if(!roles.includes(req.user.role)) { 
            return next( new AppError('You do not have permission to perform this action', 403));
        };
    next();
    };
};