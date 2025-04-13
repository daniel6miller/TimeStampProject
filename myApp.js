const express = require('express');
const app = express();
require('dotenv').config();

// Middleware
app.use(express.urlencoded({ extended: false }));

// Root Route (optional)
app.get('/', (req, res) => {
  res.send('Timestamp Microservice');
});

// Main Timestamp API
app.get('/api/:date?', (req, res) => {
  const dateParam = req.params.date;

  let date;

  // If no date provided, use current date
  if (!dateParam) {
    date = new Date();
  } else {
    // If it's a number (Unix timestamp), parse it as an integer
    if (!isNaN(dateParam)) {
      date = new Date(parseInt(dateParam));
    } else {
      // Otherwise, try to parse it as a date string
      date = new Date(dateParam);
    }
  }

  // Check for invalid date
  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  // Return Unix timestamp (milliseconds) and UTC string
  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

// Server (optional for testing)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

