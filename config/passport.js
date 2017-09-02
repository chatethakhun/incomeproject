var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var session = require('express-session');
// load up the user model


// load the auth variables
var configAuth = require('./auth');

module.exports = function(passport, url) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        var sessionUser =  'test'
        done(null, sessionUser)
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        done(null, sessionUser)
    });

    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    passport.use(new FacebookStrategy({

        // pull in our app id and secret from our auth.js file
        clientID        : configAuth.facebookAuth.clientID,
        clientSecret    : configAuth.facebookAuth.clientSecret,
        callbackURL     : configAuth.facebookAuth.callbackURL

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
        // asynchronous
        process.nextTick(function() {
            MongoClient.connect(url, function(err, db) {
              if (err) {
                console.log(err);
              }else {
                console.log("Success");
                  db.collection("user").findOne( {facebookid: profile.id}, function (error, user) {
                      if (error) {
                        console.log(error);
                      }if(user) {
                        return done(null, user);
                      }else {
                        doc = {
                            "facebookid" : profile.id,
                           "username": profile.displayName,
                           "password": randString('dgdsgffghiosgsghi;oshsophgssgiodfsgdgsdg'),
                           "token": token
                         };
                         console.log(typeof profile.id.toString());
                         db.collection("user").insert(doc, function() {
                           console.log("added 1 document");

                           db.close();
                         })
                         return done(null, doc);
                      }
                  });
              }
            })
        });

    }));

    passport.use(new GoogleStrategy({

          clientID        : configAuth.googleAuth.clientID,
          clientSecret    : configAuth.googleAuth.clientSecret,
          callbackURL     : configAuth.googleAuth.callbackURL,

      },
      function(token, refreshToken, profile, done) {

          // make the code asynchronous
          // User.findOne won't fire until we have all our data back from Google
          process.nextTick(function() {
            console.log(profile);
            MongoClient.connect(url, function(err, db) {
              if (err) {
                console.log(err);
              }else {
                console.log("Success");
                  db.collection("user").findOne( {facebookid: profile.id}, function (error, user) {
                      if (error) {
                        console.log(error);
                      }if(user) {
                        return done(null, user);
                      }else {
                        doc = {
                          "googleid" : profile.id,
                           "username": profile.displayName,
                           "password": randString('dgdsgffghiosgsghi;oshsophgssgiodfsgdgsdg'),
                           "token": token
                         };
                         console.log(typeof profile.id.toString());
                         db.collection("user").insert(doc, function() {
                           console.log("added 1 document");

                           db.close();
                         })
                         return done(null, doc);
                      }
                  });
              }
            })
              // try to find the user based on their google id
              /*User.findOne({ 'google.id' : profile.id }, function(err, user) {
                  if (err)
                      return done(err);

                  if (user) {

                      // if a user is found, log them in
                      return done(null, user);
                  } else {
                      // if the user isnt in our database, create a new user

                  }
              });*/
          });

      }));

};




function randString(id){
    console.log(id);
  var chars = "abcdefghijklmnopqrstuvwxyz!@#$%^&*()-+<>ABCDEFGHIJKLMNOP1234567890";
  var pass = "";
  for (var x = 0; x < id.length; x++) {
      var i = Math.floor(Math.random() * chars.length);
      pass += chars.charAt(i);
  }
  console.log(pass);
  return pass;
}
