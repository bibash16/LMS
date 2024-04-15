const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const AppError = require('./util/appError');
const globalErrorHandler = require('./controllers/errorController');

const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');

const app = express();


app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

app.use(express.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.join(__dirname, 'public')));

//just a testing middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
   //console.log(req.headers);
  next();
});

//starting page which has the login signup buttons
app.get('/', (req, res,next) => {
    res.sendFile(path.join(__dirname,'public','html','index.html'));
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);


//error handling for invalid routes
app.all('*',(req,res,next) => {
 next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;