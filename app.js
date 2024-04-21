const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const AppError = require('./util/appError');
const globalErrorHandler = require('./controllers/errorController');

const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');

const paginateLeaveRequests = require('./util/paginateLeaveRequests');


const app = express();

app.set('view engine', 'ejs');
app.set('views', 'D:\\LMS\\public\\html\\adminHTML');

app.use(express.json());

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

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
app.get('/admin/leaveRequests', async (req, res, next) => {
  try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10; // Adjust the default limit as needed

      // Call paginateLeaveRequests function to fetch paginated leave requests
      const { leaves, currentPage, totalPages } = await paginateLeaveRequests(page, limit);

      // Render the view with the paginated data
      res.render('adminLeaveRequests', {
          leaves,
          currentPage,
          totalPages,
          limit
      });
  } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
  }
});
app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);


//error handling for invalid routes
app.all('*',(req,res,next) => {
  //res.redirect('/api/user/login');
 next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;