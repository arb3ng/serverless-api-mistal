const express = require('express');
const serverless = require('serverless-http');
const router = require('./routes/author');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

const dbCloudUrl = 'mongodb+srv://RbDenzel:password_123@cluster0.bdcmrm4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0;';
const dbLocalUrl = 'mongodb://localhost:27017/node-api';

// Enable CORS for all origins by default (adjust based on your needs)
app.use(cors());

// Parse incoming JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB with error handling
mongoose
  .connect(dbCloudUrl || dbLocalUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1); // Optionally exit process on critical connection failure
  });

// Mount the router for API endpoints
app.use('/.netlify/functions/api', router);

module.exports.handler = serverless(app);
