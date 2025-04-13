//index.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dns = require('dns');
const urlParser = require('url');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

// In-memory URL database
let urlDatabase = [];
let id = 1;

// POST to shorten URL
app.post('/api/shorturl', function (req, res) {
  const originalUrl = req.body.url;
  const parsedUrl = urlParser.parse(originalUrl);

  // Check valid hostname via DNS
  dns.lookup(parsedUrl.hostname, (err, address) => {
    if (err || !address) {
      return res.json({ error: 'invalid url' });
    }

    // Save URL and respond with short version
    urlDatabase.push({ original_url: originalUrl, short_url: id });
    res.json({ original_url: originalUrl, short_url: id });
    id++;
  });
});

// GET to redirect short URL
app.get('/api/shorturl/:short_url', function (req, res) {
  const shortUrl = parseInt(req.params.short_url);
  const entry = urlDatabase.find(u => u.short_url === shortUrl);

  if (entry) {
    res.redirect(entry.original_url);
  } else {
    res.json({ error: 'No short URL found for given input' });
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});

