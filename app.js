const express = require('express');

const userRouter = require('./routes/userRoutes');
const adminRouter = require('./routes/adminRoutes');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
   //console.log(req.headers);
  next();
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/admin', adminRouter);

app.all('*',(req,res,next) => {
  res.status(400).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

module.exports = app;