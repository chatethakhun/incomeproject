
var bodyParser = require('body-parser');
var express = require('express');
var session = require('express-session');
var app = express();
var path = require("path");
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
  var ObjectId = require('mongodb').ObjectID;
var fs = require('fs');

module.exports = function(app, url, passport) {
    app.use(passport.session());
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
    app.use('/', express.static(path.resolve(".") + '/node_modules/i18next/dist'))
    app.use('/', express.static(path.resolve(".") + '/node_modules/i18next-xhr-backend/dist'));;



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

    app.get('/auth/facebook/callback', function(require, response, next) {
      passport.authenticate('facebook', function(err, user, info) {
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

    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

      // the callback after google has authenticated the user
      app.get('/auth/google/callback', function(require, response, next) {
        passport.authenticate('google', function(err, user, info) {
          id = user._id

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

      app.get('/auth/twitter', passport.authenticate('twitter'));

// handle the callback after twitter has authenticated the user
      app.get('/auth/twitter/callback', function(require, response, next) {
        passport.authenticate('twitter', function(err, user, info) {
          id = user._id

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

        app.get('/locales/:language', function(require, response) {
          readJSONFile(path.resolve(".") + '/public/json-languages/'+ require.params.language, function (err, json) {
        if(err) { throw err; }
            response.send(json);
          });
        });


        function readJSONFile(filename, callback) {
          fs.readFile(filename, function (err, data) {
            if(err) {
              callback(err);
              return;
            }
            try {
              callback(null, JSON.parse(data));
            } catch(exception) {
              callback(exception);
            }
          });
        }

}
