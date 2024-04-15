const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const AppError = require('./util/appError');
const globalErrorHandler = require('./controllers/errorController');

const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','html','login.html'));
});
app.post('/register', (req, res) => {
  // Redirect the user to the registration page
  res.redirect('/registration');
});


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