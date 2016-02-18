'use strict';

let fs = require('fs');
let pem = require('pem');
let path = require('path');
const constants = require('../config/constants');
const frameworkStrategies = [
  require('../dist/strategies/ExpressFrameworkStrategy/ExpressFrameworkStrategy'),
  require('../dist/strategies/HapiFrameworkStrategy/HapiFrameworkStrategy')
];

process.env.NODE_ENV = constants.TEST_ENV;

let _ = require('lodash');
let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let defaultPort = 7080;
let defaultHttpsPort = 8443;
let baseUrl;
chai.use(chaiHttp);

describe('All Framework Strategies', () => {

  frameworkStrategies.forEach((strategy) => {

    let framework = new strategy();
    let frameworkType = _.capitalize(framework.getType());
    
    function createFramework(config) {
      config = config || {
        http: {
          port: ++defaultPort 
        } 
      };
      framework = new strategy(config); 
      baseUrl = 'http://localhost:' + config.http.port;
    }

    describe(frameworkType + ' Framework Strategy', () => {

      afterEach(() => {
        if (framework.isStarted()) {
          framework.stop();
        }
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

        createFramework();

        expect(framework.isStarted()).to.be.falsy;

        return framework
          .start()
          .then(value => {
            expect(framework.isStarted()).to.be.true;
           });
      });

      it('returns promise resolved with framework upon start', () => {
        
        createFramework();
        
        return framework
          .start()
          .then(fw => {
            expect(fw).to.not.be.undefined; 
          });
      });

      it('should add and respond to a get route', () => {
      
        createFramework();

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

      it('should respond with a payload body', () => {

        createFramework();

        const body = {
          name: 'Richard',
          email: 'test@test.com' 
        };

        let resBody = {};

        return framework
          .start()
          .then(value => {

            framework.addRoute('/', {
              post: (request, respond) => {
                resBody = request.getBody();
                respond.with(200);
              } 
            });

            return chai
              .request(baseUrl)
              .post('/')
              .send(body)
              .then(res => {
                expect(resBody).to.eql(body);
              });
          });
      });

      it('should respond with a redirect', () => {
      
        createFramework();

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

        createFramework();

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
      
        createFramework();
        
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
      });

      it('should force https', (done) => {

         pem.createCertificate({days: 1, selfSigned: true}, (err, keys) => {
         
             createFramework({
               http: {
                 port: ++defaultPort
               },
               https: {
                 force: true,
                 port: ++defaultHttpsPort,
                 options: {
                   key: keys.serviceKey,
                   cert: keys.certificate 
                 }
               } 
             })

           expect(
             framework.start()
           ).to.not.throw;

           done();  

         });
      });
    });
  });
});
