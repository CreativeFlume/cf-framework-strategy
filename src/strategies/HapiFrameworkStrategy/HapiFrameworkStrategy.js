import inert from 'inert';
import constants from '../../../config/constants';
import BaseFrameworkStrategy from '../BaseFrameworkStrategy/BaseFrameworkStrategy';
import hapi from 'hapi';

class HapiFrameworkStrategy extends BaseFrameworkStrategy {
  
  constructor(config) {

    super(Object.assign({}, config, {
      type: BaseFrameworkStrategy.constants.HAPI
    }));
    this.framework = hapi;
    return this;
  }

  forceSecure(request, reply) {
    if (request.connection.info.protocol !== 'https') {
      return reply()
        .redirect('https://' + request.headers.host + request.url.path)
        .code(301);
    } 
    reply.continue();
  }

  start() {

    let superStart = super.start.bind(this);
    let port = (this.config.http && this.config.http.port) || 
      BaseFrameworkStrategy.constants.DEFAULT_PORT;

    this.server = new this.framework.Server();

    return new Promise(resolve => {
    
      this.server.register(inert, err => {
        
        if (err) {
          throw err;
        }

        this.server.connection({
          host: 'localhost',
          port: port
        });

        if (this.forceHttps) {

          this.server.connection({
            host: '0.0.0.0',
            port: this.config.https.port,
            tls: this.config.https.options  
          });

          this.server.ext('onRequest', this.forceSecure.bind(this));
        }

        if (this.config.cors) {
          this.server.connection.routes = {
            cors: true 
          } 
        }

        this.server.start(() => {
          superStart();
          resolve(this);
        });
      });
    });
  }

  stop() {
    if (this.isStarted()) {
      this.server.root.stop();
      this._isStarted = false;
    }
  }

  addRoute(path, config) {

    path = path === '*' ? '/{path*}' : path;

    for (var method in config) {
     
      this.server.route({
        path: path,
        method: method.toUpperCase(),
        handler: (request, reply) => {

          this.hapiRequest = request;
          this.hapiReply = reply;

          config[method](this.request(), this.respond());
        }
      });

    } 
  }

  request() {
    return {
      getPath: () => {
        return this.hapiRequest.url.path;
      },
      getBody: () => {
        return this.hapiRequest.payload; 
      },
      getCookies: () => {
        return this.hapiRequest.state; 
      }
    }; 
  }

  respond() {
    return {

      with: (code, body) => {

       if (code >= 300 && code <= 308) {
         this
           .hapiReply
           .redirect(body)
           .code(code);
         return; 
       }

        this
          .hapiReply(body)
          .code(code);
      },

      withFile: fileLocation => {

        this
          .hapiReply
          .file(fileLocation); 
      }
    }; 
  }
}

module.exports = HapiFrameworkStrategy;
