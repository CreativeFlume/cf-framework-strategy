'use strict';

var expect = require('chai').expect;
var server = require('../../../dist/strategies/BaseFrameworkStrategy/BaseFrameworkStrategy');

describe('Base Framework Strategy', function () {
  it('should store framework type constants', function () {
    expect(server.constants).to.not.be.undefined;
  });
});