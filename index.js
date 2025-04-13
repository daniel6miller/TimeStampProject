const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

// In-memory "database"
let users = [];

// POST /api/users => create new user
app.post('/api/users', (req, res) => {
  const { username } = req.body;
  const newUser = {
    username,
    _id: uuidv4(),
    log: []
  };
  users.push(newUser);
  res.json({ username: newUser.username, _id: newUser._id });
});

// GET /api/users => return all users
app.get('/api/users', (req, res) => {
  const list = users.map(u => ({ username: u.username, _id: u._id }));
  res.json(list);
});

// POST /api/users/:_id/exercises => add an exercise
app.post('/api/users/:_id/exercises', (req, res) => {
  const { _id } = req.params;
  const { description, duration, date } = req.body;
  const user = users.find(u => u._id === _id);
  if (!user) return res.json({ error: 'User not found' });

  const exercise = {
    description,
    duration: parseInt(duration),
    date: date ? new Date(date).toDateString() : new Date().toDateString()
  };

  user.log.push(exercise);

  res.json({
    _id: user._id,
    username: user.username,
    date: exercise.date,
    duration: exercise.duration,
    description: exercise.description
  });
});

// GET /api/users/:_id/logs => return exercise logs (optional from, to, limit)
app.get('/api/users/:_id/logs', (req, res) => {
  const { _id } = req.params;
  const { from, to, limit } = req.query;
  const user = users.find(u => u._id === _id);
  if (!user) return res.json({ error: 'User not found' });

  let log = user.log;

  // Filter by date range
  if (from) {
    const fromDate = new Date(from);
    log = log.filter(e => new Date(e.date) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    log = log.filter(e => new Date(e.date) <= toDate);
  }

  // Limit log results
  if (limit) {
    log = log.slice(0, parseInt(limit));
  }

  res.json({
    _id: user._id,
    username: user.username,
    count: log.length,
    log: log
  });
});

// Start server
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

