const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const catchAsync = require('./../util/catchAsync');
const AppError = require('./../util/appError');
const path = require('path');
const EmailService = require('./../util/email');

const emailService = new EmailService();

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.getSignUp = catchAsync(async(req,res,next)=>{
  res.render(path.join(__dirname,'..','public','html','registration.ejs'));
});

exports.postSignUp = async(req,res,next) => {
   try {
    const existingUser = await User.findOne({email: req.body.email});

    if(existingUser) { 
      req.flash('error', 'Email already exists! Please choose a different email.');
      return res.status(400).redirect('/api/v1/user/registration');
    }

    const fullName = req.body.firstname+' '+req.body.lastname;
    const newUser = await User.create({
        
        name: fullName,
        email: req.body.email,
        password: req.body.password,
        position: req.body.position,
        contactNumber: req.body.contact,
        passwordCreatedAt: req.body.passwordCreatedAt
    });

    const token = signToken(newUser._id);

    await emailService.sendWelcomeEmail(newUser);

    res.redirect('/api/v1/user/login');
   }catch (error) {
      req.flash('error', 'Error creating user. Please try again!');
      return res.status(500).redirect('/api/v1/user/registration');
    }
};

exports.getLogin = catchAsync(async (req,res,next) => {

  res.render(path.join(__dirname, '..','public', 'html', 'login.ejs'));
});

exports.postLogin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  try {

  if (!email || !password) {
    req.flash('error', 'Please provide Email and Password.'); 
    res.redirect('/api/v1/user/login');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    req.flash('error', 'Incorrect email or password.');
    res.redirect('/api/v1/user/login');
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
  } catch (error) {
     req.flash('error', 'Failed to login! Try Again with correct credentials.');
  }
};

exports.postLogout = catchAsync(async (req,res,next) => {
  res.cookie('jwt', '', { expires: new Date(0), httpOnly: true });

  res.status(200).redirect('/');
});

exports.protect = catchAsync(async (req, res, next) => {
  // Get token and check if it's there
  let token;

  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    req.flash('error',{ statusCode: 401, message: 'You are not logged in! Please log in to get access.'});
    return  res.redirect('/api/user/login');
  }

  // Verify token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //check if token has expired
  if (decoded.exp < Date.now() / 1000) {
    req.flash('error', { statusCode: 401, message: 'You are not logged in! Please log in to get access.'});
    return res.redirect('/api/user/login');
  }  
  // Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    req.flash('error',{ statusCode: 401, message: 'The user belonging to this token does no longer exist.'});
    return res.redirect('/api/user/login');
  }

  //  Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    req.flash('error',{ statusCode: 401, message: 'User recently changed password! Please log in again.'});
    return res.redirect('/api/user/login');
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
            req.flash('error',{ statusCode: 403, message: 'You do not have permission to perform this action'});
            return res.redirect('/api/user/login');
        };
    next();
    };
};