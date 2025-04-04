// Dependencies
import express, { Application } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import api from './api';

const app: Application = express();

// CORS setup
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? process.env.APP_URL : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// MongoDB connection
const mongoUri: string = process.env.NODE_ENV === 'production' ? process.env.MONGO_URI || '' : 'mongodb://localhost:27017/visarch';
mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err: Error) => console.error(err));

// Use API routes
app.use('/api', api);

// Start the server
const PORT: number = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
