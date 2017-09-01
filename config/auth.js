var express = require('express');
var app = express();
var session = require('express-session');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');


module.exports = function(app, url) {
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
}
