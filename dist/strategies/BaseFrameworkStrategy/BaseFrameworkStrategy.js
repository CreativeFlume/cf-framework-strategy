'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var constants = require('../../../config/constants');

var _ = require('lodash');

var BaseFrameworkStrategy = function () {
  function BaseFrameworkStrategy(config) {
    _classCallCheck(this, BaseFrameworkStrategy);

    this.config = config;
    this.forceHttps = config.https && config.https.force === true;
  }

  _createClass(BaseFrameworkStrategy, [{
    key: 'getType',
    value: function getType() {
      return this.config.type;
    }
  }, {
    key: 'isStarted',
    value: function isStarted() {
      return this._isStarted;
    }
  }, {
    key: 'start',
    value: function start() {

      if (process.env.NODE_ENV !== constants.TEST_ENV) {

        if (this.forceHttps) {
          console.log('\n\n          ' + _.capitalize(this.config.type) + ' server redirecting http port ' + this.config.http.port + ' to ' + this.config.https.port + '\n\n        ');
        } else {
          console.log('\n\n          ' + _.capitalize(this.config.type) + ' server started on port ' + (this.config.http.port || BaseFrameworkStrategy.constants.DEFAULT_PORT) + ' \n\n        ');
        }
      }

      this._isStarted = true;
    }
  }]);

  return BaseFrameworkStrategy;
}();

BaseFrameworkStrategy.constants = {
  EXPRESS: 'express',
  HAPI: 'hapi',
  DEFAULT_PORT: 80
};

module.exports = BaseFrameworkStrategy;