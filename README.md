# cf-framework-strategy

### A Minimalist Node.js Framework Abstraction

** Work in Progress**

This node web framework abstraction strives to provide a consistent, pragmatic, and smart
*standard* for interacting with node's native http module through the various competing high 
performing frameworks such as Express and Hapi.

Why is it that with every new major framework version, we are left with painful
code rewriting? How come when you start a new project and you decide on a different
framework, you are left with less than ideal amounts of code reuse from previous projects even
though you're doing the exact same things? I mean, how many different ways do we know to send 
a response and read from a request? This should all be standardized by now. The responsible 
thing for new framework creators to do would be heed the inherent advice from previous 
frameworks rather than introduce new interfaces simply because the author prefers a particular 
wording or syntax.  Unless the change in interface is purely for performance gains, which, 
I would argue, the interface should be decoupled from this *ANYWAYS*, consistency should be 
a primary goal.

In the case where a framework interface *must* change due to some performance (or security) implication,
you can be confident that your client projects can be updated with a quick change in dependency.

Meet *cf-framework-strategy*. It goes a little something like this:

```
YourProjectA__                             __Express
              \                           /
               respond.with(200, 'Hello')---AnotherFutureFramework
YourProjectB__/                           \__Hapi
```

Perhaps this project will grow into a number of separate libraries all inheriting from some base
interface; this way, different versionings of each framework can be supported exclusive to each other.
If community backing ever grows on this, that is a real consideration, but for now, I'm hapi, err, I mean
happy with the latest versions of every framework I use.

I am not vocal about marketing this idea, but if you came across this on NPM, I invite you to try it out
and contribute.  It may prove worth your while.

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

### Responding With a File
```
  respond.withFile(location);
```
