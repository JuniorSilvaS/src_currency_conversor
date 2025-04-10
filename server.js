require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { neon } = require("@neondatabase/serverless");

const app = express();
const port = process.env.PORT || 3000;
const countryRoutes = require('./routes/countryRoutes');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');

// Use middlewares
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Use the country routes
app.use('/api/countries', countryRoutes);
app.use('/api/user', userRoutes);


// Start the server
app.listen(port, () => {
  console.log("ONLINE");
  console.log(`The server is running at http://localhost:${port}`);
});
