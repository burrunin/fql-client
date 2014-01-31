FQL Client
==========
A very simple client for FQL Facebook API. Allows to make raw queries in FQL and features some shortcuts to some common needs.

##Usage
You must create first a client with the token you want to use and then you can invoke the method `query` to make raw SQL queries. The library supports multiples queries at once.

```js
var FQL = require('fql-client');

var client = new FQL('YOUR TOKEN HERE');

client.query('SELECT about FROM page WHERE username="FashionSoAwesome"', console.log);

client.query({
    one: 'SELECT about, pic FROM page WHERE username="FashionSoAwesome"',
    two: 'SELECT about FROM page WHERE username="asociacionseiva"'
}, console.log);
```

It has the following shortcuts, that can be seen as query `SELECT * FROM table WHERE ...`. For use them, you must pass a indexable field. 

 Method|Result|More Info  
 :---|:---:|:---:|
 user| JSON of the user / undefined|  [User table](https://developers.facebook.com/docs/reference/fql/user/) 
 photo| Array with results / undefined | [Photo table](https://developers.facebook.com/docs/reference/fql/photo/) 
 event| Array with results / undefined |  [Event table](https://developers.facebook.com/docs/reference/fql/event/)

##Roadmap

The library is current in a really early stage, use with caution. It's planned to remove the superagent dependency.


##License

(The MIT License)

Copyright (c) 2014 Bruno Durán <bruno.duran.rey@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.