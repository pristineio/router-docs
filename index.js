'use strict';
var pug = require('pug');
var express = require('express');
var tv4 = require('tv4');
var util = require('util');
var STRING_TYPE = '<String>';
var self;

function RouterDocs(app, opts) {
  self = this;
  opts = opts || {};

  if(opts.pretty) {
    app.engine('pug', pug.renderFile);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'pug');
    app.use('/docs', express.static(__dirname + '/views'));
  }

  if('disable' in opts) {
    app.docs = function() { };
    return;
  }

  app.docs = function(obj, literal) {
    var idx = app._router.stack.length-1;
    var layer = app._router.stack[idx];
    layer.docs = {};

    if(literal) {
      return Object.keys(obj).forEach(function(k) {
        layer.docs[k] = obj[k];
      });
    }
    if(typeof obj === 'string') {
      obj = {description: obj};
    }

    ['title', 'method', 'resource', 'path', 'description', 'headers']
      .forEach(function(k) {
        if(obj[k]) {
          layer.docs[k] = obj[k];
        }
      }
    );

    if('requestBody' in obj) {
      layer.docs.requestBody = {};
      if(Array.isArray(obj.requestBody)) {
        layer.docs.requestBody = obj.requestBody;
      } else {
        Object.keys(obj.requestBody).sort(function(a,b) {
          a = obj.requestBody[a].$required;
          b = obj.requestBody[b].$required;
          return a && b ? 0 : !a && b ? 1 : !b && a ? -1 : 0;
        }).forEach(function(x) {
          layer.docs.requestBody[x] = obj.requestBody[x];
        });
      }
    } else if('requestArray' in obj) {
      layer.docs.requestArray = obj.requestArray;
    } else if('requestVariants' in obj) {
      layer.docs.requestVariants = {};
      obj.requestVariants.forEach(function(x,i) {
        layer.docs.requestVariants[i] = x;
      });
    }

    if(layer.keys.length > 0) {
      layer.docs.requestParameters = {};
      layer.keys.forEach(function(x,i) {
        layer.docs.requestParameters[':' + x.name] = {};
        if('requestParameters' in obj && obj.requestParameters[i]) {
          Object.keys(obj.requestParameters[i]).forEach(function(k) {
            layer.docs.requestParameters[':' + x.name][k] =
              obj.requestParameters[i][k];
          });
          switch(obj.requestParameters[i].type) {
            case 'string':
              layer.docs.requestParameters[':' + x.name].type = STRING_TYPE;
              break;
          }
        }
      });
    }
    if('queryParameters' in obj) {
      layer.docs.queryParameters = obj.queryParameters;
    }
    if('responseCodes' in obj) {
      layer.docs.responseCodes = obj.responseCodes;
    }
    if('exampleResponse' in obj) {
      layer.docs.exampleResponse = obj.exampleResponse;
    }
    if('exampleRequest' in obj) {
      layer.docs.exampleRequest = obj.exampleRequest;
    }
  };

  var copyData = function(opts) {
    var resource = opts.resource;
    var routes = opts.target;
    resource = resource.substr(0,1).toUpperCase() + resource.substr(1);
    if(!(resource in routes)) {
      routes[resource] = [];
    }
    routes[resource].push({
      path: opts.path,
      verb: opts.method.toUpperCase()
    });
    Object.keys(opts.docs).forEach(function(k) {
      routes[resource][routes[resource].length - 1][k] = opts.docs[k];
    });
  };

  app.get('/docs', function(req, res) {
    var routes = {};
    app._router.stack.forEach(function(x) {
      if(!x.docs) {
        return;
      }
      if(!x.route) {
        copyData({
          method: x.docs.method,
          path: x.docs.path,
          docs: x.docs,
          resource: x.docs.resource,
          target: routes
        });
        return;
      }
      Object.keys(x.route.methods).sort().forEach(function(method) {
        copyData({
          method: method,
          path: x.route.path,
          docs: x.docs,
          resource: x.route.path.split('/')[1],
          target: routes
        });
      });
    });

    var routesSorted = {};
    Object.keys(routes).sort().forEach(function(x) {
      routesSorted[x] = routes[x].sort(function(a,b) {
        return a.title >= b.title;
      });
    });

    if('pretty' in opts && !!opts.pretty) {
      return res.render('index', {
        appLocals: app.locals,
        routes: routesSorted
      });
    }
    res.json(routesSorted);
  });
}

RouterDocs.prototype.render = function(res, routes) {
  res.render('index', {
    title: 'API Docs',
    appLocals: {version: '1.0.0', fqdn: 'api.example.com'},
    routes: routes
  });
};

module.exports = RouterDocs;
