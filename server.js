require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

// POST api/shorturl/:short_url endpoint
app.post('/api/shorturl', function(req, res) {
  console.log("write req body to memory")
});

// GET api/shorturl/:short_url endpoint
app.get('/api/shorturl/:short_url', function(req, res) {
  res.json({ redirect: {
    from: req.params.short_url,
    to: "lookup req and find endpoint to redirect to"
  } });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
