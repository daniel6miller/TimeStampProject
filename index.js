// index.js
var express = require('express');
var cors = require('cors');
var app = express();

// Middleware
app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Serve HTML
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Test route
app.get("/api/hello", function (req, res) {
  res.json({ greeting: 'hello API' });
});

// Timestamp Microservice route
app.get("/api/:date?", function (req, res) {
  const dateParam = req.params.date;
  let date;

  if (!dateParam) {
    date = new Date();
  } else {
    // Handle UNIX timestamp
    if (!isNaN(dateParam)) {
      date = new Date(parseInt(dateParam));
    } else {
      date = new Date(dateParam);
    }
  }

  if (date.toString() === "Invalid Date") {
    return res.json({ error: "Invalid Date" });
  }

  res.json({
    unix: date.getTime(),
    utc: date.toUTCString()
  });
});

// Start server
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
