var session = require('express-session');
var bodyParser = require('body-parser');
var express = require('express');
var app = express();
var path = require("path");

module.exports = function(app) {
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


};
