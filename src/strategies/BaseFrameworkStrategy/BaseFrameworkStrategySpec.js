'use strict';

var expect = require('chai').expect;
var server = require('./BaseFrameworkStrategy');

describe('Base Framework Strategy', () => {
  it('should store framework type constants', () => {
    expect(server.constants).to.not.be.undefined;    
  });
});
