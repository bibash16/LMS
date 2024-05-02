class AppError extends Error {
  constructor(message, statusCode) {
    super(message); 

    this.statusCode = statusCode;
    //if statuscode starts with 4 set status to fail
    //otherwise set it to error
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // show that the error is operational and not programming error
    this.isOperational = true;

    //captures stack trace at the point of error for better error
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;

//custom error class AppError is created with
//additional properties

