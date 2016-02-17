'use strict';

let express = require('./strategies/ExpressFrameworkStrategy/ExpressFrameworkStrategy');
let hapi = require('./strategies/HapiFrameworkStrategy/HapiFrameworkStrategy');

module.exports = {
  express: express,
  hapi: hapi
};
