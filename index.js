var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var favicon = require('favicon');
var session = require('express-session');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


var configDB = require('./config/database.js')
var url = configDB.url;
require('./app/routes.js')(app);
require('./config/auth.js')(app,url);
require('./app/models/user.js')(app, url);
require('./app/models/income.js')(app, url);





MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to server");
  db.close();
});

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});














app.use(session({
  secret: 'rreteyurtettyietfga345664363'
}))
