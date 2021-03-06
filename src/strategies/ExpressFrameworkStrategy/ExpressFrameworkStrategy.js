'use strict';

import http from 'http';
import https from 'https';
import path from 'path';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import BaseFrameworkStrategy from '../BaseFrameworkStrategy/BaseFrameworkStrategy';
import express from 'express';

class ExpressFrameworkStrategy extends BaseFrameworkStrategy {
  
  constructor(config) {
    super(Object.assign({}, {
      type: BaseFrameworkStrategy.constants.EXPRESS
    }, config));
    this.framework = express;
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

    me.app.enable('trust proxy');

    if (me.config.helmet) {
      me.app.use(require('helmet')({
        hsts: false 
      })); 
    }

    if (me.config.serveStatic) {
      me.app.use(me.framework.static(me.config.serveStatic));
    }

    if (me.config.cors) {
      me.app.use((req, res, next) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        next();
      });
    }

    me.app.use(bodyParser.json());
    me.app.use(bodyParser.urlencoded({ extended: true }));
    me.app.use(cookieParser());

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
        config[method](this.request(request), this.respond(response));
      });
    }
  }

  request(request) {
    return {
      getPath: () => request.url,
      getBody: () => request.body,
      getCookies: () => request.cookies,
      getHeaders: () => request.headers,
      getIp: () => request.ip
    };
  }
  
  respond(response) {
    return {
      removeCookie: (name, opts) => {
        response.clearCookie(name, opts);
        return this;
      },
      setCookie: (name, value, opts) => {
        response.cookie(name, value, opts);
        return this;
      },
      with: (code, body) => {
       if (code >= 300 && code <= 308) {
         response.redirect(body);
         return;
       }
       response.status(code).send(body);
     },
      
      withFile: (fileName, fileLocation) => {
        response.sendFile(fileName, {
          root: fileLocation 
        });
      }
    };
  }
}

module.exports = ExpressFrameworkStrategy;
