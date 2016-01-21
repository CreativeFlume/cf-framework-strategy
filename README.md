# cf-framework-strategy

### A Minimalist Node.js Framework Abstraction

This abstraction provides a clean
interface such that if a framework introduces breaking
changes (perhaps to affect performance), your application
code is utilizing a clean and unchanging interface. Then we 
can easily port our client applications to the newest version.

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
        respond.with(200, 'Hello World');
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
        respond.with(200, 'Hello World');
      }
    });

  });
```
