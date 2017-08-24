var express = require('express');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var favicon = require('favicon');
app.set('port', (process.env.PORT || 5000));
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
var session = require('express-session');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://localhost:27017/infoDB';
//"mongodb://localhost:27017/infoDB"
//'mongodb://chatethakhun:Jack1234@ds038319.mlab.com:38319/income'

app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use('/', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/', express.static(__dirname + '/node_modules/font-awesome'));
app.use('/', express.static(__dirname + '/node_modules/jquery-validation/dist'));
app.use('/', express.static(__dirname + '/node_modules/jquery-bootgrid/dist'));
app.use('/', express.static(__dirname + '/node_modules/bootstrap-datepicker/dist'));
app.use('/', express.static(__dirname + '/node_modules/jquery-confirm/dist'));

app.use(session({
  secret: 'rreteyurtettyietfga345664363'
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







app.get('/', function(require, response) {

      response.render('pages/index');

});

app.get('/admin', function(require, response) {
  if(session.auth == "Who!!!!!!!") {
    response.render('pages/admin');
  }else {
    response.redirect('/login');
  }

});


app.get('/login', function(require, response) {

    if(session.auth == "Who!!!!!!!") {
      response.redirect('/insertForm');
    }else {
      response.render('pages/login');
    }

});

app.get('/insertForm', function(require, response) {

    if(session.auth == "Who!!!!!!!") {
      response.render('pages/insert');
    }else {
      response.redirect('/login');
    }

});

app.get('/view', function(require, response) {

    if(session.auth == "Who!!!!!!!") {
      response.render('pages/view');
    }else {
      response.redirect('/login');
    }

});











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
      var cursor= db.collection("incomeDB").find({ "income_id": session.id});
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
