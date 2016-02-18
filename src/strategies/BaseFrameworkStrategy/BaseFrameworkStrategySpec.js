'use strict';

var expect = require('chai').expect;
var server = require('../../../dist/strategies/BaseFrameworkStrategy/BaseFrameworkStrategy');

describe('Base Framework Strategy', () => {
  it('should store framework type constants', () => {
    expect(server.constants).to.not.be.undefined;    
  });
});
