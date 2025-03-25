const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());

// Body parser
app.use(express.json());

// Routes
app.use('/api/todos', require('./routes/todoRoutes'));
app.use('/api/todos', todoRoutes);
app.use('/api/users', userRoutes);


// Home route
app.get('/', (req, res) => {
  res.send('Todo API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in on port ${PORT}`);
});