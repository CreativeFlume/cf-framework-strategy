'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inert = require('inert');

var _inert2 = _interopRequireDefault(_inert);

var _constants = require('../../../config/constants');

var _constants2 = _interopRequireDefault(_constants);

var _BaseFrameworkStrategy = require('../BaseFrameworkStrategy/BaseFrameworkStrategy');

var _BaseFrameworkStrategy2 = _interopRequireDefault(_BaseFrameworkStrategy);

var _hapi = require('hapi');

var _hapi2 = _interopRequireDefault(_hapi);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HapiFrameworkStrategy = (function (_BaseFrameworkStrateg) {
  _inherits(HapiFrameworkStrategy, _BaseFrameworkStrateg);

  function HapiFrameworkStrategy(config) {
    var _ret;

    _classCallCheck(this, HapiFrameworkStrategy);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(HapiFrameworkStrategy).call(this, Object.assign({}, config, {
      type: _BaseFrameworkStrategy2.default.constants.HAPI
    })));

    _this.framework = _hapi2.default;
    return _ret = _this, _possibleConstructorReturn(_this, _ret);
  }

  _createClass(HapiFrameworkStrategy, [{
    key: 'forceSecure',
    value: function forceSecure(request, reply) {
      if (request.connection.info.protocol !== 'https') {
        return reply().redirect('https://' + request.headers.host + request.url.path).code(301);
      }
      reply.continue();
    }
  }, {
    key: 'start',
    value: function start() {
      var _this2 = this;

      var superStart = _get(Object.getPrototypeOf(HapiFrameworkStrategy.prototype), 'start', this).bind(this);
      var port = this.config.http && this.config.http.port || _BaseFrameworkStrategy2.default.constants.DEFAULT_PORT;

      this.server = new this.framework.Server();

      return new Promise(function (resolve) {

        _this2.server.register(_inert2.default, function (err) {

          if (err) {
            throw err;
          }

          _this2.server.connection({
            host: 'localhost',
            port: port
          });

          if (_this2.forceHttps) {

            _this2.server.connection({
              host: '0.0.0.0',
              port: _this2.config.https.port,
              tls: _this2.config.https.options
            });

            _this2.server.ext('onRequest', _this2.forceSecure.bind(_this2));
          }

          _this2.server.start(function () {
            superStart();
            resolve(_this2);
          });
        });
      });
    }
  }, {
    key: 'stop',
    value: function stop() {
      if (this.isStarted()) {
        this.server.root.stop();
        this._isStarted = false;
      }
    }
  }, {
    key: 'addRoute',
    value: function addRoute(path, config) {
      var _this3 = this;

      path = path === '*' ? '/{path*}' : path;

      for (var method in config) {

        this.server.route({
          path: path,
          method: method.toUpperCase(),
          handler: function handler(request, reply) {

            _this3.hapiRequest = request;
            _this3.hapiReply = reply;

            config[method](_this3.request(), _this3.respond());
          }
        });
      }
    }
  }, {
    key: 'request',
    value: function request() {
      var _this4 = this;

      return {
        getPath: function getPath() {
          return _this4.hapiRequest.url.path;
        },
        getBody: function getBody() {
          return _this4.hapiRequest.payload;
        },
        getCookies: function getCookies() {
          return _this4.hapiRequest.state;
        }
      };
    }
  }, {
    key: 'respond',
    value: function respond() {
      var _this5 = this;

      return {

        with: function _with(code, body) {

          if (code >= 300 && code <= 308) {
            _this5.hapiReply.redirect(body).code(code);
            return;
          }

          _this5.hapiReply(body).code(code);
        },

        withFile: function withFile(fileLocation) {

          _this5.hapiReply.file(fileLocation);
        }
      };
    }
  }]);

  return HapiFrameworkStrategy;
})(_BaseFrameworkStrategy2.default);

module.exports = HapiFrameworkStrategy;