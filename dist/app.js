'use strict';

var express = require('./strategies/ExpressFrameworkStrategy/ExpressFrameworkStrategy');
var hapi = require('./strategies/HapiFrameworkStrategy/HapiFrameworkStrategy');

module.exports = {
  express: express,
  hapi: hapi
};