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
var flash  = require('connect-flash');
var passport = require('passport')
app.use(passport.initialize());
app.use(passport.session());
 app.use(flash());
var configDB = require('./config/database.js')
var url = configDB.url;
require('./app/routes')(app, url, passport);
require('./app/models/income')(app, url);
require('./config/auth');
require('./config/passport')(app,passport, url);
require('./app/models/user')(app, url);


app.use(session({
  saveUninitialized: true, // saved new sessions
  resave: false, // do not automatically write to the session store
  secret: "dfgdsfsdkldfsafsdlfsd'fk;",
  cookie : { httpOnly: true, maxAge: 2419200000 }
}))



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
