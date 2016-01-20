'use strict';

let FrameworkStrategy = require('../src/app').express;

let framework = new FrameworkStrategy({
  port: 3000
});

framework
  .start()
  .then(() => {

    framework.addRoute('/', {
      get: (request, respond) => {
        respond.with(200, 'Hello World');
      }
    });

  });
