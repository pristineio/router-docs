'use strict';
var assert = require('assert');
var request = require('request');
var routerDocs = require('./../index');
var app = require('express')();
var port = 3333;
var baseUrl = 'http://localhost:' + port + '/docs';

describe('router-docs', function() {
  before(function() {
    routerDocs(app);
    require('http').Server(app);
    app.listen(port);
  });

  it('Should parameterize docs return a valid response', function(done) {
    app.get('/testOne', function(req, res, next) {
      res.status(200).end();
    }).docs('Test');

    app.get('/testTwo', function(req, res, next) {
      res.status(200).end();
    }).docs({
      description: 'Test'
    });

    app.post('/testThree/:alpha/extra/:beta', function(req, res, next) {
      res.status(200).end();
    }).docs({
      description: 'Test',
      requestParameters: [
        {
          type: 'integer',
          minimum: 2,
          maximum: 128
        },
        {
          type: 'string',
          pattern: '^[a-zA-Z0-9]$'
        }
      ]
    });

    app.put('/testLiteral', function(req, res, next) {
      res.status(200).end();
    }).docs({
      foo: 'bar',
      pu: ['ber']
    }, true);

    request.get({url: baseUrl}, function(err, res, docs) {
      console.dir(JSON.parse(docs), {depth: null, colors: true});
      assert(!err && res.statusCode === 200);
      done();
    });
  });
});
