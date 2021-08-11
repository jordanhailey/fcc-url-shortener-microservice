require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

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
app.use('/api/shorturl',bodyParser.urlencoded({ extended: true }))
app.post('/api/shorturl',function(req, res) {
  let url = req.body.url;
  if (/^http{1}[s]{0,1}:\/\//.test(url)) {
    // Strip leading http[s]://
    let [match,...other] = url.match(/^http{1}[s]{0,1}:\/\//)
    url = url.substr(match.length)
  }
  dns.lookup(url, (err, address, family) =>
    {
      if (err) res.json({ error: 'invalid url' });
      else res.json({"original_url":req.body.url,"short_url":"TODO"})
    });
  
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
