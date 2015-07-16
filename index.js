'use strict';

module.exports = function(app) {
  app.docs = function(obj) {
    if(typeof obj === 'string') {
      obj = {description: obj};
    }
    this._router.stack[app._router.stack.length-1].docs = {
      description: obj.description
    };
  };

  app.get('/docs', function(req, res) {
    var routes = {};
    app._router.stack.map(function(x) {
      if(!x.docs) {
        return;
      }
      var subRoutes = {};
      Object.keys(x.route.methods).forEach(function(method) {
        if(!(method.toUpperCase() in subRoutes)) {
          subRoutes[method.toUpperCase()] = {
            path: x.route.path
          };
        }
        Object.keys(x.docs).forEach(function(k) {
          subRoutes[method.toUpperCase()][k] = x.docs[k];          
        });
      });
      return subRoutes;
    }).filter(function(x) {
      return !!x;
    }).forEach(function(x) {
      var verb = Object.keys(x)[0];
      if(!(verb in routes)) {
        routes[verb] = [];
      }
      routes[verb].push(x[verb]);
    });
    var routesSorted = {};
    var keys = Object.keys(routes).sort();
    Object.keys(keys).forEach(function(k) {
      routesSorted[keys[k]] = routes[keys[k]];
    });
    res.json(routesSorted);
  });
};