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

exports.getSignUp = catchAsync(async (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'registration.html'));
});

exports.postSignUp = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    contactNumber: req.body.contactNumber,
    position: req.body.position,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordCreatedAt: req.body.passwordCreatedAt,
    role: req.body.role
  });

  const token = signToken(newUser._id);

  res.status(201).redirect('/api/v1/user/login');
});

exports.getLogin = catchAsync(async (req, res, next) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'login.html'));
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

  res.redirect('/dashboard');
});

exports.getDashboard = (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'html', 'dashboard.html'));
};

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist.', 401)
    );
  }

  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action', 403));
    }
    next();
  };
};
exports.register = catchAsync(async (req, res, next) => {
  // Your user registration logic here
});