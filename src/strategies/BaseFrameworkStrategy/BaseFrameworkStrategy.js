'use strict';

const constants = require('../../../config/constants');

let _ = require('lodash');

class BaseFrameworkStrategy {

  constructor(config) {
    this.config = config;
    this._isStarted = false;
  }

  getType() {
    return this.type; 
  }

  isStarted() {
    return this._isStarted;
  }

  start() {

    if (process.env.NODE_ENV !== constants.TEST_ENV) {
      console.log(`

        ${_.capitalize(this.config.type)} server started on port ${this.config.port || BaseFrameworkStrategy.constants.DEFAULT_PORT} 

      `);
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
