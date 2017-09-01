var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
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
        callbackURL     : configAuth.facebookAuth.callbackURL,
        profileFields: ['id','username', 'displayName', 'link', 'about_me', 'photos', 'email']

    },

    // facebook will send back the token and profile
    function(token, refreshToken, profile, done) {
      console.log(profile);
        // asynchronous
        process.nextTick(function() {

            MongoClient.connect(url, function(err, db) {
              console.log("TEST");
              if (err) {
                console.log(err);
              }else {
                console.log("Success");
                  db.collection("user").findOne( {facebook_id: profile.id}, function (error, user) {
                      if (error) {
                        console.log(error);
                      }if(user) {
                        console.log('found');
                        console.log(user);
                        return done(null, user);
                      }else {
                        console.log('not found');
                        doc = {
                            "facebook_id" : profile.id,
                           "username": profile.displayName,
                           "password": "1234",
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
                  //console.log(cursor);
              }
            })
            // find the user in the database based on their facebook id
          /*  User.findOne({ 'facebook.id' : profile.id }, function(err, user) {

                // if there is an error, stop everything and return that
                // ie an error connecting to the database
                if (err)
                    return done(err);

                // if the user is found, then log them in
                if (user) {
                    return done(null, user); // user found, return that user
                } else {
                    // if there is no user found with that facebook id, create them
                    var newUser            = new User();

                    // set all of the facebook information in our user model
                    newUser.facebook.id    = profile.id; // set the users facebook id
                    newUser.facebook.token = token; // we will save the token that facebook provides to the user
                    newUser.facebook.name  = profile.name.givenName + ' ' + profile.name.familyName; // look at the passport user profile to see how names are returned
                    newUser.facebook.email = profile.emails[0].value; // facebook can return multiple emails so we'll take the first

                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }

            });*/
        });

    }));

};
