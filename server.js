require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');
const fs = require('fs');

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

function getSavedUrls(){
  const {urls} = JSON.parse(fs.readFileSync(__dirname + "/db.json",{encoding:'utf8'}));
  return urls
}

// POST api/shorturl/:short_url endpoint
app.use('/api/shorturl',bodyParser.urlencoded({ extended: true }))
app.post('/api/shorturl',function(req, res) {
  let url = req.body.url;
  if (/^http{1}[s]{0,1}:\/\//.test(url)) {
    // Strip leading http[s]://
    let [match,...other] = url.match(/^http{1}[s]{0,1}:\/\//)
    url = url.substr(match.length)
  }
  dns.lookup(url.split("/")[0], (err, address, family) =>
    {
      if (err) res.json({ error: 'invalid url' });
      else {
        const urls = getSavedUrls();
        const idx = urls.length;
        urls.push(req.body.url);
        fs.writeFileSync(__dirname + "/db.json",JSON.stringify({urls},null,2),{encoding:'utf8'});
        res.json({"original_url":req.body.url,"short_url":idx})
      }
    });
});

// GET api/shorturl/:short_url endpoint
app.get('/api/shorturl/:short_url', function(req, res) {
  const redirAddress = getSavedUrls()[req.params.short_url] || "/";
  res.redirect(redirAddress);
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
