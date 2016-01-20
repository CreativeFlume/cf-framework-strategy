'use strict';

const constants = require('../../../config/constants');
const BaseFrameworkStrategy = require('../BaseFrameworkStrategy/BaseFrameworkStrategy');

class HapiFrameworkStrategy extends BaseFrameworkStrategy {
  
  constructor(config) {
    super(Object.assign({}, config, {
      type: BaseFrameworkStrategy.constants.HAPI
    }));
    this.type = BaseFrameworkStrategy.constants.HAPI;
    this.framework = require(BaseFrameworkStrategy.constants.HAPI);
    return this;
  }

  start() {

    let superStart = super.start.bind(this);

    this.server = new this.framework.Server();

    this.server.connection({
      host: 'localhost',
      port: this.config.port || BaseFrameworkStrategy.constants.DEFAULT_PORT
    });

    return new Promise(resolve => {
      this.server.start(() => {
        superStart();
        resolve();
      });
    });
  }

  stop() {
    if (this.isStarted()) {
      this.server.root.stop();
    }
  }

  addRoute(path, config) {
    for (var method in config) {
      
      this.server.route({
        path: path,
        method: method.toUpperCase(),
        handler: (request, reply) => {

          this.hapiRequest = request;
          this.hapiReply = reply;

          config[method](this.request, this.respond());
        }
      });

    } 
  }

  respond() {
    return {
      with: (code, body) => {

        this
          .hapiReply(body)
          .code(code);
      }
    }; 
  }
}

module.exports = HapiFrameworkStrategy;
