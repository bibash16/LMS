const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');

const AppError = require('./util/appError');
const globalErrorHandler = require('./controllers/errorController');

const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');

//why is this  here?
const paginateLeaveRequests = require('./util/paginateLeaveRequests');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'D:\\LMS\\public\\html\\adminHTML');

app.use(express.json());

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser());

app.use(session({
  secret: 'secrets-secret-key',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(flash());

//clearing flash messages after they have been displayed
app.use((req, res, next) => {
  res.locals.messages = req.flash();
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
  next( res.status(500).render(path.join(__dirname, '..', 'public', 'html', '500.ejs')));
  
// next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;