'use strict';

const constants = require('../../../config/constants');

let _ = require('lodash');

class BaseFrameworkStrategy {

  constructor(config) {
    this.config = config;
    this.forceHttps = config.https && config.https.force === true;
  }

  getType() {
    return this.config.type; 
  }

  isStarted() {
    return this._isStarted;
  }

  start() {

    if (process.env.NODE_ENV !== constants.TEST_ENV) {

      if (this.forceHttps) {
        console.log(`

          ${_.capitalize(this.config.type)} server redirecting http port ${this.config.http.port} to ${this.config.https.port}

        `); 
      } else {
        console.log(`

          ${_.capitalize(this.config.type)} server started on port ${this.config.port || BaseFrameworkStrategy.constants.DEFAULT_PORT} 

        `);
      }
    }

    this._isStarted = true;
  }
}

BaseFrameworkStrategy.constants = {
  EXPRESS: 'express',
  HAPI: 'hapi',
  DEFAULT_PORT: 80
};

module.exports = BaseFrameworkStrategy;
