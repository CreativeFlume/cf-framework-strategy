# cf-framework-strategy

### A Minimalist Node.js Framework Abstraction

** Work in Progress**

This abstraction provides a clean
interface such that if a framework introduces breaking
changes (perhaps to affect performance), your application
code is utilizing a clean and unchanging interface. Then we 
can easily port our client applications to the newest version.

### Assumes ES6

It's assumed you have a transpilation method. Refer to 
[this](http://stackoverflow.com/questions/35040978/babel-unexpected-token-import-when-running-mocha-tests)
stackoverflow post for an example using babel-core/register for runtime transpilation. This will solve the
commonly seen `unexpected token import` error.

 

### Example Express Usage
```
let FrameworkStrategy = require('cf-framework-strategy').express;

let framework = new FrameworkStrategy({
  port: 3000
});

framework
  .start()
  .then(() => {

    framework.addRoute('/', {
      get: (request, respond) => {
        respond.with(200, 'Hello Express');
      }
    });

  });
```

### Example Hapi Usage
```
let FrameworkStrategy = require('cf-framework-strategy').hapi;

let framework = new FrameworkStrategy({
  port: 3000
});

framework
  .start()
  .then(() => {

    framework.addRoute('/', {
      get: (request, respond) => {
        respond.with(200, 'Hello Hapi');
      }
    });

  });
```
