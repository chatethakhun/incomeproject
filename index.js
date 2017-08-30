var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var favicon = require('favicon');
var session = require('express-session');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var configDB = require('./config/database.js')
var url = configDB.url;
require('./app/routes.js')(app);

app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));








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


app.post('/auth',function(require, response){
  if (require.body.username == "admin"  && require.body.password == "admin") {
        session.auth = "Who!!!!!!!";
    response.redirect('/admin');

  }else {
    MongoClient.connect(url, function(err, db) {
        var cursor = db.collection("user").find({username: require.body.username, password: require.body.password}).toArray(function(err,item){
          item.forEach(function(select){

            id = select._id;
          })
          if(item.length == 0) {
            response.redirect('/login');
          }
          else{
            session.auth = "Who!!!!!!!";
            session.id = id;
            response.redirect('/redirect');
          }
        });
      });
  }


});

app.get('/redirect', function (require, response){
  if(session.auth == "Who!!!!!!!") {
    response.redirect('/insertForm');
  }else {
    response.redirect('/login');
  }
});

app.get('/logout',function (require,response) {
  delete session.auth == "Who!!!!!!!";
  //session.destroy;
  //require.session = null;
  //console.log(require.session.destroy());
  response.redirect('/login');
})

app.post('/insert',function(require, response) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
     doc = {
       "income_id": ObjectId(session.id),
        "date": require.body.date,
        "income": require.body.income,
        "outcome": require.body.outcome,
        "incomedetail": require.body.incomedetail,
        "outcomedetail": require.body.outcomedetail,
        "note": require.body.note
      };
      db.collection("incomeDB").insert(doc, function() {
        console.log("added 1 document");
        response.redirect('/view');
        db.close();
      });
  });
});


app.post('/insertUser',function(require, response) {
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
     doc = {
        "username": require.body.username,
        "password": require.body.password
      };
      db.collection("user").insert(doc, function() {
        console.log("added 1 document");
        response.redirect('/admin');
        db.close();
      });
  });
});


app.get('/find',function(require, response) {
  response.setHeader('Content-Type', 'application/json');
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    if (require.query.searchPhrase == '') {
      var cursor= db.collection("incomeDB").find({ "income_id": session.id}).sort({"_id":-1})
      var rownum = 0;
      var countvalue = cursor;
      countvalue.count().then((count) => {
        rownum = count;
      });
      var arr = [];
      var offset = Math.floor((parseInt(require.query.current)-1)*(Math.sqrt(13) + Math.sqrt(5)));;
      cursor.skip(offset).limit(parseInt(require.query.rowCount));
       // เช็คว่า ถ้ามีค่า current = 0parseInt(require.query.current) - 1 + parseInt(require.query.rowCount)
       //console.log(cursor.readConcern());
       cursor.forEach(function(item) {
         arr.push(item);
        }, function(error) {
              response.send({
              current: parseInt(require.query.current),
              rowCount: parseInt(require.query.rowCount),
              rows: arr,
              total: rownum
          });
        db.close();
      });
    }else {
      var cursor = db.collection("incomeDB").find({"income_id" : session.id,incomedetail : {$regex: require.query.searchPhrase}});
      var rownum = 0;
      var countvalue = cursor;
      countvalue.count().then((count) => {
        rownum = count;
      });
      var arr = [];
      var offset = Math.floor((parseInt(require.query.current)-1)*(Math.sqrt(13) + Math.sqrt(5)));;
      cursor.skip(offset).limit(parseInt(require.query.rowCount));

       cursor.forEach(function(item) {
        arr.push(item);
      }, function(error) {
        response.send({
          current: parseInt(require.query.current),
          rowCount: parseInt(require.query.rowCount),
          rows: arr,
          total: rownum
        });
        db.close();
      });
    }

  });
});
app.get('/findUser',function(require, response) {
  response.setHeader('Content-Type', 'application/json');
  MongoClient.connect(url, function(err, db) {
    assert.equal(null, err);
    if (require.query.searchPhrase == '') {
      var cursor= db.collection("user").find();
      var rownum = 0;
      var countvalue = cursor;
      countvalue.count().then((count) => {
        rownum = count;
      });
      var arr = [];
      var offset = Math.floor((parseInt(require.query.current)-1)*(Math.sqrt(13) + Math.sqrt(5)));;
      cursor.skip(offset).limit(parseInt(require.query.rowCount));
       // เช็คว่า ถ้ามีค่า current = 0parseInt(require.query.current) - 1 + parseInt(require.query.rowCount)
       //console.log(cursor.readConcern());
       cursor.forEach(function(item) {
         arr.push(item);
        }, function(error) {
              response.send({
              current: parseInt(require.query.current),
              rowCount: parseInt(require.query.rowCount),
              rows: arr,
              total: rownum
          });
        db.close();
      });
    }else {
      var cursor = db.collection("user").find({username : {$regex: require.query.searchPhrase}});
      var rownum = 0;
      var countvalue = cursor;
      countvalue.count().then((count) => {
        rownum = count;
      });
      var arr = [];
      var offset = Math.floor((parseInt(require.query.current)-1)*(Math.sqrt(13) + Math.sqrt(5)));;
      cursor.skip(offset).limit(parseInt(require.query.rowCount));

       cursor.forEach(function(item) {
        arr.push(item);
      }, function(error) {
        response.send({
          current: parseInt(require.query.current),
          rowCount: parseInt(require.query.rowCount),
          rows: arr,
          total: rownum
        });
        db.close();
      });
    }
})
});


app.post('/delete/:id', function(require, response){
  response.setHeader('Content-Type', 'application/json');
  MongoClient.connect(url, function(err, db) {
      var doc = ObjectId(require.params.id);
        db.collection('incomeDB').deleteOne( {_id: doc});
           db.close();
  });
});

app.post('/deleteUser/:id', function(require, response){
  response.setHeader('Content-Type', 'application/json');
  MongoClient.connect(url, function(err, db) {
      var doc = ObjectId(require.params.id);
        db.collection('user').deleteOne( {_id: doc});
           db.close();
  });
});

app.get('/find/:id', function(require, response){
  response.setHeader('Content-Type', 'application/json');
  MongoClient.connect(url, function(err, db) {
      var doc = ObjectId(require.params.id);
      var cursor = db.collection("incomeDB").find({_id : doc});
      var arr = [];
       cursor.forEach(function(item) {
         response.send({
          item
         });
      }, function(error) {
        db.close();
      });
  });
});


app.post('/update', function(require, response){
  response.setHeader('Content-Type', 'application/json');
  MongoClient.connect(url, function(err, db) {
    console.log("UPDATE");
    var myquery = {
      _id: new ObjectId(require.body.id),
    }
    var newDoc = {
      $set: {
        "date": require.body.date,
        "income": require.body.income,
        "incomedetail": require.body.incomedetail,
        "outcome": require.body.outcome,
        "outcomedetail": require.body.outcomedetail,
        "note": require.body.note
      }
    };
    db.collection("incomeDB").updateOne(myquery, newDoc, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.redirect('/view');
      db.close();
    }); // });
  });
});
