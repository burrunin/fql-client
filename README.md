**This library is as deprecated as the API that references to**

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
