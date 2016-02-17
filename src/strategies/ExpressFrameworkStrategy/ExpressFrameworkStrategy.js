'use strict';

let http = require('http');
let https = require('https');
let path = require('path');
const bodyParser = require('body-parser');
const BaseFrameworkStrategy = require('../BaseFrameworkStrategy/BaseFrameworkStrategy');

class ExpressFrameworkStrategy extends BaseFrameworkStrategy {
  
  constructor(config) {
    super(Object.assign({}, {
      type: BaseFrameworkStrategy.constants.EXPRESS
    }, config));
    this.framework = require(BaseFrameworkStrategy.constants.EXPRESS);
    this.app = this.framework();
    return this;
  }

  forceSecure(req, res, next) {
    if (req.secure || req.headers['x-forwarded-proto'] === 'https') {
      return next(); 
    } 
    res.redirect('https://' + req.hostname + ':' + this.config.https.port + req.url);
  }

  start() {

    let me = this;
    let superStart = super.start.bind(me);
    let port = (me.config.http && me.config.http.port) || 
      BaseFrameworkStrategy.constants.DEFAULT_PORT;

    if (me.config.serveStatic) {
      me.app.use(me.framework.static(me.config.serveStatic));
    }

    me.app.use(bodyParser.json());
    if (me.forceHttps) {
      me.app.use(me.forceSecure.bind(me));
    }

    return new Promise(resolve => {

      me.server = http
        .createServer(me.app)
        .listen(port, () => {

          if (me.config.https && me.config.https.port) {

            me.httpsServer = https
              .createServer(me.config.https.options, me.app)
              .listen(me.config.https.port, () => {
                superStart();
                resolve(me);
              });

          } else {
            superStart(); 
            resolve(me); 
          } 
        });
      });
  };

  stop() {
    if (this.isStarted()) {
      if (this.httpsServer) {
        this.httpsServer.close();
      }
      this.server.close();
      this._isStarted = false;
    } 
  }

  addRoute(path, config) {

    for (var method in config) {
    
      this.app[method](path, (request, response) => {

        this.expressRequest = request;
        this.expressResponse = response;
        
        config[method](this.request(), this.respond())
      });
    }
  }

  request() {
    return {
      getPath: () => {
        return this.expressRequest.url;
      },
      getBody: () => {
        return this.expressRequest.body; 
      }
    };
  }
  
  respond() {
    return {
      with: (code, body) => {

       if (code >= 300 && code <= 308) {
         this
           .expressResponse
           .redirect(body);
         return;
       }

       this
         .expressResponse
         .status(code)
         .send(body);
     },
      
      withFile: fileLocation => {
        this
          .expressResponse
          .sendFile(fileLocation);
      }
    };
  }
}

module.exports = ExpressFrameworkStrategy;
