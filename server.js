var SERVER_API_KEY = 'AIzaSyBvxaMfTNW8rTcgxmb-JPjI-6JGunLlE-o';

var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var request = require('request');

var app = express();
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(__dirname));




var subscribers = {};
var subscribtions = {};
var messages = {};


app.post('/create-notification', function(req, res) {
  var direction = req.body.direction,
    auid = req.cookies.auid;

  subscribtions[direction] = subscribtions[direction] || {};
  subscribtions[direction][req.cookies.auid] = true;

  console.log('add subscribtion');
  console.log('direction', direction);
  console.log('auid', auid);

  res.json({});
});

var get_subscriber_id = function(endpoint) {
  return (endpoint + '').split('/').pop();
};

app.get('/subscribe', function(req, res) {
  var auid = req.cookies.auid;
  //to identify user
  if (!auid) {
    auid = Math.random().toString(36).substring(7);;
    res.cookie('auid', auid, {
      expires: new Date(Date.now() + 900000)
    });
  }

  var subscriber_id = get_subscriber_id(req.body.endpoint);

  console.log('register new user');
  console.log('subscriber_id', subscriber_id);
  console.log('auid', auid);
  subscribers[auid] = subscriber_id;

  res.json(req.body);
});

app.get('/notify', function(req, res) {
  var direction = req.query.direction,
    message = req.query.message,
    notify = Object.keys(subscribtions[direction] || {});
  for (var i in notify) {
    var auid = notify[i];
    messages[auid] = messages[auid] || [];
    messages[auid].push(message);
  }
  //send push to google server
  var options = {
    url: 'https://android.googleapis.com/gcm/send',
    method: 'post',
    body: {
      registration_ids: notify.map(function(auid) {
        return subscribers[auid];
      })
    },
    json: true,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'key=' + SERVER_API_KEY
    }
  };

  request.post(options, function(e, r, body) {
    console.log(body);
  });

  res.json({});
});

app.get('/api', function(req, res) {
  //get user messages by cookie
  var auid = req.cookies.auid;
  var response_data = [];
  if (messages[auid]) {
    for (var i in messages[auid]) {
      var msg = messages[auid][i];
      response_data.push({
        body: msg,
        title: 'Test title',
        url: 'http://google.com/',
        icon: 'https://emoji.slack-edge.com/T03ACLDU5/dzmitry/e7e44b445d22e639.jpg'
      });
    }
    messages[auid] = [];
  }
  res.json({
    messages: response_data
  });
});

var server = app.listen(3000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
