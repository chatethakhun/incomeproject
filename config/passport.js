var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var express = require('express');
var session = require('express-session');
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

// load up the user model


// load the auth variables
var configAuth = require('./auth');

module.exports = function (app, passport, url) {
      app.use(passport.session());
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
            MongoClient.connect(url, function(err, db) {
              if (err) {
                console.log(err);
              }else {
                  db.collection("user").findOne( {googleid: profile.id}, function (error, user) {
                      if (error) {
                        return done(null, error);
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
          });

      }));

      passport.use(new TwitterStrategy({

        consumerKey     : configAuth.twitterAuth.consumerKey,
        consumerSecret  : configAuth.twitterAuth.consumerSecret,
        callbackURL     : configAuth.twitterAuth.callbackURL

      },
      function(token, tokenSecret, profile, done) {

          // make the code asynchronous
      // User.findOne won't fire until we have all our data back from Twitter
          process.nextTick(function() {

            MongoClient.connect(url, function(err, db) {
              if (err) {
                console.log(err);
              }else {
                  db.collection("user").findOne( {twitterid: profile.id}, function (error, user) {
                      if (error) {
                        return done(null, error);
                      }if(user) {
                        return done(null, user);
                      }else {
                        doc = {
                          "twitterid" : profile.id,
                           "username": profile.username,
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
