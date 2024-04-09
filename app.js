const express = require('express');

const AppError = require('./util/appError');
const globalErrorHandler = require('./controllers/errorController');

const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');

const app = express();

app.use(express.json());

//just a testing middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
   //console.log(req.headers);
  next();
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);

//error handling for invalid routes
app.all('*',(req,res,next) => {
 next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;