'use strict';

const BaseFrameworkStrategy = require('../BaseFrameworkStrategy/BaseFrameworkStrategy');

class ExpressFrameworkStrategy extends BaseFrameworkStrategy {
  
  constructor(config) {
    super(config);
    this.type = BaseFrameworkStrategy.constants.EXPRESS;
    this.framework = require(BaseFrameworkStrategy.constants.EXPRESS);
    this.app = this.framework();
    return this;
  }

  start() {

    let superStart = super.start.bind(this);
    let port = this.config.port || BaseFrameworkStrategy.constants.DEFAULT_PORT;

    return new Promise(resolve => {
      this.server = this.app.listen(port, () => {
        superStart();
        resolve(); 
      });
    });
  }

  stop() {
    if (this.isStarted()) {
      this.server.close();
    } 
  }

  addRoute(path, config) {
    for (var method in config) {
    
      this.app[method](path, (request, response) => {

        this.expressRequest = request;
        this.expressResponse = response;
        
        config[method](this.request, this.respond())
      });
    }
  }

  respond() {
    return {
      with: (code, body) => {
        this
          .expressResponse
          .status(code)
          .send(body);
      } 
    };
  }
}

module.exports = ExpressFrameworkStrategy;
