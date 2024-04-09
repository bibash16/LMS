const mongoose = require('mongoose');
const dotenv = require('dotenv');
const AppError = require('./util/appError');


process.on('uncaughtException', err => {
  console.log('Uncaught exception, Shutting down.');
  console.log(err.name, err.message);
  process.exit(1);
});


dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
   // useNewUrlParser: true,
    //createIndexes: true,
    //useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on('unhandledRejection', err => {
  console.log('Unhandled Rejection, Shutting down.');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});