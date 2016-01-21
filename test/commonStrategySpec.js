'use strict';

let path = require('path');
const constants = require('../config/constants');
const baseUrl = 'http://localhost:4567';
const frameworkStrategies = [
  require('../src/strategies/ExpressFrameworkStrategy/ExpressFrameworkStrategy'),
  require('../src/strategies/HapiFrameworkStrategy/HapiFrameworkStrategy')
];

process.env.NODE_ENV = constants.TEST_ENV;

let _ = require('lodash');
let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;

chai.use(chaiHttp);

describe('All Framework Strategies', () => {

  frameworkStrategies.forEach((strategy) => {

    let framework = new strategy();
    let frameworkType = _.capitalize(framework.getType());
    framework.stop();
    
    describe(frameworkType + ' Framework Strategy', () => {

      beforeEach(() => {
        framework = new strategy({
          port: 4567
        });
      });

      afterEach(() => {
        framework.stop();
      });

      it('should instantiate with the correct interface', () => {
        expect(typeof framework.getType).to.equal('function');
        expect(typeof framework.isStarted).to.equal('function');
        expect(typeof framework.start).to.equal('function');
        expect(typeof framework.stop).to.equal('function');
        expect(typeof framework.addRoute).to.equal('function');
        expect(typeof framework.request).to.equal('function');
        expect(typeof framework.respond).to.equal('function');
      });

      it('should track whether framework is started', () => {

        expect(framework.isStarted()).to.be.false; 

        return framework
          .start()
          .then(value => {
            expect(framework.isStarted()).to.be.true;
           });
      });

      it('returns promise resolved with framework upon start', () => {
        
        return framework
          .start()
          .then(fw => {
            expect(fw).to.not.be.undefined; 
          });
      });

      it('should add and respond to a get route', () => {
      
        return framework
          .start()
          .then(value => {

            framework.addRoute('/', {
              get: (request, respond) => {
                respond.with(200, 'abc');
              }
            });

            return chai
              .request(baseUrl)
              .get('/')
              .then(res => {
                expect(res.text).to.equal('abc');
                expect(res.status).to.equal(200);
              });
          });
      });

      it('should respond with a redirect', () => {
      
        return framework
          .start()
          .then(value => {

            framework.addRoute('/abc', {
              get: (request, respond) => {
                respond.with(200, 'redirect successful');
              }
            })

            framework.addRoute('/', {
              get: (request, respond) => {
                respond.with(302, '/abc');
              }
            });

            return chai
              .request(baseUrl)
              .get('/')
              .then(res => {
                expect(res.status).to.equal(200);
                expect(res.text).to.equal('redirect successful');
              });
          });
      });

      it('should respond with a file', () => {

        return framework
          .start()
          .then(value => {

            framework.addRoute('/', {
              get: (request, respond) => {
                respond.withFile(path.join(__dirname, 'commonStrategySpec.js'));
              }   
            });

            return chai
              .request(baseUrl)
              .get('/')
              .then((res) => {
                expect(res.status).to.equal(200);
              });
          });
      });

      it('should return the requested path', () => {
      
        return framework
          .start()
          .then(value => {

            let path;

            framework.addRoute('/a/b', {
              get: (request, respond) => {
                path = request.getPath();
                respond.with(200);
              }
            });

            return chai
              .request(baseUrl)
              .get('/a/b')
              .then(() => {
                expect(path).to.equal('/a/b');
              });
          });
      })
    });
  });
});
