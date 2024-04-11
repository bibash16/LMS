const AppError = require('./../util/appError');

//cast errors handling
const handleCastErrorDB = err => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

//validation errors in the database
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

//Invalid token error handling
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

//Expired token error handling
const handleJWTExpiredError = () =>
  new AppError('Your token has expired! Please log in again.', 401);

//NODE_ENV=development error logging
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

//NODE_ENV=production error logging

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });

    // Programming or other unknown error: don't leak error details
  } else {
    //Log error
    console.error('ERROR!', err);

    // Send error message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};

//express error handling middleware
//new errors need to be put here so next(err) calls go here
module.exports = (err, req, res, next) => {
  
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};
