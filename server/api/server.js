// Dependencies 
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const api = require('./api');

const app = express();

// CORS setup
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.APP_URL : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// MongoDB connection
const mongo_uri = process.env.NODE_ENV === 'production' ? process.env.MONGO_URI : 'mongodb://localhost:27017/visarch';
mongoose.connect(mongo_uri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Use API routes
app.use('/api', api);


// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});