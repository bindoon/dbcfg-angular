var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');

var bodyParser = require('body-parser');
var config = require('config');
var fs = require('fs');
var extend = require('util')._extend;

var db = require('./app/models');
var Settings = config.global;


function midway(app) {

        // view engine setup
    app.set('views', path.join(__dirname, 'app/views'));
    app.set('view engine', 'xtpl');

    // uncomment after placing your favicon in /public
    //app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, 'app/public')));

    app.use(function(req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');

        var params = req.query;
        params = extend(params,req.body);
        req.getParam = function (key) {
            return params[key];
        }
        req.getParamObject = function() {
            return params;
        }
      next();
    });

    function addRouterFromFolder() {
        var folderPath =  path.join(__dirname, 'app/routes/');

        if (fs.existsSync(folderPath)) {
            try {
                fs.readdirSync(folderPath).forEach(function(fileName) {
                    var filePath = path.join(folderPath, fileName),
                        fileStat = fs.statSync(filePath);

                    if (fileStat.isDirectory()) {
                        addRouterFromFolder(filePath);
                    } else if (fileStat.isFile()) {
                        var requireRouter = require(filePath);
                        app.use(requireRouter);
                        console.info('[router] %s is attached successfully',filePath);
                    }
                });
            } catch (ex) {
                console.error(
                    '[router] failed to add router directory: %s, %s', folderPath, ex);
            }
        }
    }
    addRouterFromFolder();

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
      var err = new Error('Not Found');
      err.status = 404;
      next(err);
    });

    // error handlers

    // development error handler
    // will print stacktrace
    if (app.get('env') === 'local') {
      app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
          message: err.message,
          error: err
        });
      });
    }

    // production error handler
    // no stacktraces leaked to user
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: {}
      });
    });

    return app;
}


module.exports = midway;
