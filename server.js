require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { neon } = require("@neondatabase/serverless");

const app = express();
const port = process.env.PORT || 3000;
const countryRoutes = require('./routes/countryRoutes');
const userRoutes = require('./routes/userRoutes');

// Use middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use the country routes
app.use('/api/countries', countryRoutes);
app.use('/api/user', userRoutes);


// Start the server
app.listen(port, () => {
  console.log("ONLINE");
  console.log(`The server is running at http://localhost:${port}`);
});
