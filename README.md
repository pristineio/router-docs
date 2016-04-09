# Router Docs: API extension for express
[![Code Climate](https://codeclimate.com/github/pristineio/router-docs/badges/gpa.svg)](https://codeclimate.com/github/pristineio/router-docs)

This module adds a `docs` method to the express application object, as well as a `/docs` route that renders a Jade template for pretty documentation.

### Usage
```js
var app = express();
require('router-docs')(app);
app.get('/twoHunny', function(req, res) {
  res.status(200).end();
}).docs('Never gonna give you up...');

app.put('/foHunny', function(req, res) {
  res.status(400).end();
}).docs({
  title: 'Fo Hunny Method',
  description: 'Never gonna let you down...'
});

app.post('/juicy/:alpha/fruit/:beta', function(req, res, next) {
  res.status(200).end();
}).docs({
  title: 'Juicy Fruit'
  description: 'Never gonna run around and...',
  // Supply JSON Schema properties in the order of route request parameters
  // See: http://json-schema.org/latest/json-schema-validation.html
  requestBody: {
    fruit: 'Stripe',
    gum: 123
  },
  requestParameters: [
    { // alpha
      type: 'integer',
      minimum: 2,
      maximum: 128
    },
    { //beta
      type: 'string',
      pattern: '^[a-zA-Z0-9]$'
    }
  ]
});
```
### Ideas and TODO
- Supply custom middleware to the constructor, affecting /docs behavior
- Construct `example` properties based on the parameter and body specs of the routes
- Implement `response` field
- Export JSON schemas and/or allow for request/response validation

### License
MIT License
Copyright (c) 2015, [Pristine Inc.](http://pristine.io)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
