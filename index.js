// index.js
var express = require('express');
var cors = require('cors');
var app = express();

// Enable CORS so API is remotely testable by FCC
app.use(cors({ optionsSuccessStatus: 200 }));

// Serve static files from /public
app.use(express.static('public'));

// Serve the index HTML on root
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

// Test endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// ✅ NEW: Request Header Parser Microservice endpoint
app.get('/api/whoami', (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const language = req.headers['accept-language'];
  const software = req.headers['user-agent'];

  res.json({
    ipaddress: ip,
    language: language,
    software: software
  });
});

// Start server
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

