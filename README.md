FQL Client
==========
A very simple client for FQL Facebook API. Allows to make raw queries in FQL and features some shortcuts to some common needs.

##Usage
You first must create a client with the token you want to use

```js
var FQL = require('fql-client');

var client = new FQL('YOUR TOKEN HERE');
```

Once the client is created, you can invoke the method `query` to make raw SQL queries. The library supports multiples queries at once.

```js
client.query('SELECT about FROM page WHERE username="FashionSoAwesome"', console.log);

client.query({
    one: 'SELECT about, pic FROM page WHERE username="FashionSoAwesome"',
    two: 'SELECT about FROM page WHERE username="asociacionseiva"'
}, console.log);
```

##Roadmap

The project is intended to grow as our needs do, but if you want to make a pull request or suggest something you're welcome. Our future work probably will  remove the dependencies and make it browser compatible is desired but not in our plans right now.
