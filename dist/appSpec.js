'use strict';

var expect = require('chai').expect;
var app = require('./app');

describe('app', function () {
  it('exposes express strategy', function () {
    expect(app.express).to.not.be.undefined;
  });
  it('exposes hapi strategy', function () {
    expect(app.hapi).to.not.be.undefined;
  });
});