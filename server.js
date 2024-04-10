// Set up Express server
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: './config.env' });
const app = express();

// MongoDB connection setup
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    //useNewUrlParser: true,
    //useCreateIndex: true,
    //useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'))
  .catch(err => console.error('DB connection error:', err));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve login.html when a user navigates to the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public','html','login.html'));
});
app.get('/public', (req, res) => {
  res.redirect('/html/registration.html'); // Redirect to a specific page
});


// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
