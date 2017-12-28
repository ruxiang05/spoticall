const express = require('express'),
      bodyParser = require('body-parser'),
      twilio = require('twilio'),
      request = require('request');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {
    res.send('Hello world');
});

app.get('/song', function(req, res) {
  const query = req.query.q;
  getSong(query)
  .then(function(song) {
    res.send(song);
  })
  .catch(function(err) {
    res.send(err.message);
  });
});

app.post('/sms', function(req, res) {
  const from = req.body.From,
        body = req.body.Body;

  res.send(`
    <Response>
      <Message>
        Thanks for texting: ${body}
      </Message>
    </Response>
  `);
});

function getSong(song) {
  return new Promise(function(resolve, reject) {
    request({
      url: 'https://api.spotify.com/v1/search',
      method: 'GET',
      qs: {
        type: 'track',
        q: 'song'
      },
      json: true
    }, function (err, resp, body) {
      if(err) {
        return reject(err);
      }

      try {
        const trackUrl = body.tracks.items[0].preview_url;
        return resolve(trackUrl);
      } catch (e){
        return reject(new Error('Sorry, track not found'));
      }
    });
  });
}

app.listen(3000);
