var session = require('express-session');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var path = require("path");
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  var ObjectId = require('mongodb').ObjectID;

module.exports = function(app, url, passport) {
    app.use(bodyParser.json());
    app.use('/', express.static(path.resolve(".") + '/public'));
    app.use('/', express.static(path.resolve(".") + '/node_modules/jquery/dist'));
    app.use('/', express.static(path.resolve(".") + '/node_modules/bootstrap/dist'));
    app.use('/', express.static(path.resolve(".") + '/node_modules/font-awesome'));
    app.use('/', express.static(path.resolve(".") + '/node_modules/jquery-validation/dist'));
    app.use('/', express.static(path.resolve(".") + '/node_modules/jquery-bootgrid/dist'));
    app.use('/', express.static(path.resolve(".") + '/node_modules/bootstrap-datepicker/dist'));
    app.use('/', express.static(path.resolve(".") + '/node_modules/jquery-confirm/dist'));
    app.use('/', express.static(path.resolve(".") + '/node_modules/moment'));

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

        if(session.auth == "Who!!!!!!!" + session.id && session.id != '') {
          response.redirect('/insertForm');
        }else {
          response.render('pages/login');
        }

    });

    app.get('/insertForm', function(require, response) {
        console.log(session.auth);
        if(session.auth == "Who!!!!!!!" + session.id && session.id != '') {
          response.render('pages/insert');
        }else {
          response.redirect('/login');
        }

    });

    app.get('/view', function(require, response) {

        if(session.auth == "Who!!!!!!!" + session.id && session.id != '') {
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

                session.id = id;
                session.auth = "Who!!!!!!!" + session.id;
                response.redirect('/redirect');
              }
            });
          });
      }


    });

    app.get('/redirect', function (require, response){
      if(session.auth == "Who!!!!!!!" + session.id && session.id != '') {
        response.redirect('/insertForm');
      }else {
        response.redirect('/login');
      }
    });

    app.get('/logout',function (require,response) {
      delete session.auth;
      //session.destroy;
      //require.session = null;
      //console.log(require.session.destroy());
      response.redirect('/login');
    })
    app.get('/authUser/:id',function(require, response){
      console.log(require.params.id);
      session.id = ObjectId(require.params.id);
      session.auth = "Who!!!!!!!" + ObjectId(require.params.id)
      response.redirect('/insertForm');
    });

    app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));

// handle the callback after facebook has authenticated the user
  /*  app.get('/auth/facebook/callback',
        passport.authenticate('facebook', function (err,user) {

          if (user) {
            response.redirect('/insertForm');
            session.auth == "Who!!!!!!!"
          }


      }
    ));*/

          app.get('/auth/facebook/callback', function(require, response, next) {
  passport.authenticate('facebook', function(err, user, info) {
    console.log(user._id);
    id = user._id
    console.log(info);
    if (err) {
      return next(err);
    }
    if (!user) {
      return response.redirect('/login');
    }
    require.logIn(user, function(err) {
      if (err) { return next(err);
      }//console.log("132123123");
      return response.redirect('/authUser/' + id );
    });
  })(require, response, next);
});

};
