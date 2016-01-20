'use strict';

var expect = require('chai').expect;
var app = require('./app');

describe('app', () => {
  it('exposes express strategy', () => {
    expect(app.express).to.not.be.undefined;
  });
  it('exposes hapi strategy', () => {
    expect(app.hapi).to.not.be.undefined;
  });
});
