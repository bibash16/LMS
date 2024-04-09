const express =require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path'); 

dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    //useNewUrlParser: true,
    //createIndexes: true,
    //useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});