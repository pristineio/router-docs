#Router Docs#
###API extension for express###

This module adds a `docs` method to the express application object. 

###Usage###
```
var app = express();
require('router-docs')(app);
app.get('/twoHunny', function(req, res) {
  res.status(200).end();
}).docs('Liveness check');

app.get('/foHunny', function(req, res) {
  res.status(400).end();
}).docs({
  description: 'More detailed description'
});
```
