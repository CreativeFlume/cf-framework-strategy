'use strict';

// describes the core behavior and interface 
// all framework strategies should implement

const constants = require('../config/constants');

process.env.NODE_ENV = constants.TEST_ENV;

let _ = require('lodash');
let chai = require('chai');
let chaiHttp = require('chai-http');
let expect = chai.expect;
let baseUrl = 'http://localhost:4567';
let frameworkStrategies = [
  require('../src/strategies/ExpressFrameworkStrategy/ExpressFrameworkStrategy'),
  require('../src/strategies/HapiFrameworkStrategy/HapiFrameworkStrategy')
];

chai.use(chaiHttp);

describe('All Framework Strategies', () => {

  frameworkStrategies.forEach((strategy) => {

    let framework = new strategy();
    let frameworkType = framework.getType(); 
    framework.stop();
    
    describe(_.capitalize(frameworkType) + ' Framework Strategy', () => {

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
    });
  });
});

