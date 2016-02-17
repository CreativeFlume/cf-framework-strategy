'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _BaseFrameworkStrategy = require('../BaseFrameworkStrategy/BaseFrameworkStrategy');

var _BaseFrameworkStrategy2 = _interopRequireDefault(_BaseFrameworkStrategy);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ExpressFrameworkStrategy = (function (_BaseFrameworkStrateg) {
  _inherits(ExpressFrameworkStrategy, _BaseFrameworkStrateg);

  function ExpressFrameworkStrategy(config) {
    var _ret;

    _classCallCheck(this, ExpressFrameworkStrategy);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ExpressFrameworkStrategy).call(this, Object.assign({}, {
      type: _BaseFrameworkStrategy2.default.constants.EXPRESS
    }, config)));

    _this.framework = _express2.default;
    _this.app = _this.framework();
    return _ret = _this, _possibleConstructorReturn(_this, _ret);
  }

  _createClass(ExpressFrameworkStrategy, [{
    key: 'forceSecure',
    value: function forceSecure(req, res, next) {
      if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
        return next();
      }
      res.redirect('https://' + req.hostname + ':' + this.config.https.port + req.url);
    }
  }, {
    key: 'start',
    value: function start() {

      var me = this;
      var superStart = _get(Object.getPrototypeOf(ExpressFrameworkStrategy.prototype), 'start', this).bind(me);
      var port = me.config.http && me.config.http.port || _BaseFrameworkStrategy2.default.constants.DEFAULT_PORT;

      if (me.config.serveStatic) {
        me.app.use(me.framework.static(me.config.serveStatic));
      }

      me.app.use(_bodyParser2.default.json());
      if (me.forceHttps) {
        me.app.use(me.forceSecure.bind(me));
      }

      return new Promise(function (resolve) {

        me.server = _http2.default.createServer(me.app).listen(port, function () {

          if (me.config.https && me.config.https.port) {

            me.httpsServer = _https2.default.createServer(me.config.https.options, me.app).listen(me.config.https.port, function () {
              superStart();
              resolve(me);
            });
          } else {
            superStart();
            resolve(me);
          }
        });
      });
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this.isStarted()) {
        if (this.httpsServer) {
          this.httpsServer.close();
        }
        this.server.close();
        this._isStarted = false;
      }
    }
  }, {
    key: 'addRoute',
    value: function addRoute(path, config) {
      var _this2 = this;

      for (var method in config) {

        this.app[method](path, function (request, response) {

          _this2.expressRequest = request;
          _this2.expressResponse = response;

          config[method](_this2.request(), _this2.respond());
        });
      }
    }
  }, {
    key: 'request',
    value: function request() {
      var _this3 = this;

      return {
        getPath: function getPath() {
          return _this3.expressRequest.url;
        },
        getBody: function getBody() {
          return _this3.expressRequest.body;
        }
      };
    }
  }, {
    key: 'respond',
    value: function respond() {
      var _this4 = this;

      return {
        with: function _with(code, body) {

          if (code >= 300 && code <= 308) {
            _this4.expressResponse.redirect(body);
            return;
          }

          _this4.expressResponse.status(code).send(body);
        },

        withFile: function withFile(fileLocation) {
          _this4.expressResponse.sendFile(fileLocation);
        }
      };
    }
  }]);

  return ExpressFrameworkStrategy;
})(_BaseFrameworkStrategy2.default);

module.exports = ExpressFrameworkStrategy;