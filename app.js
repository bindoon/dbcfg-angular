var express = require('express');
var midway = require('./midway');
global.Promise =  require('promise');

var app = midway(express());

module.exports = app;
