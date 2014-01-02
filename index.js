var  agent = require('superagent');


module.exports = Client = function(options) {
    if (!(this instanceof Client)) {
        return new Client(options);
    };

    this.options = options?((typeof options === 'string'?{ "token": options }:options):{};
};

Client.prototype.query = function(q, fn){
    var o = { "q": typeof q === 'string'? q : JSON.stringify(q) };

    if(this.options.token) o.access_token = this.options.token;

    agent
        .get('https://graph.facebook.com/fql')
        .query(o)
        .end(function(e, r){
            if(e) return fn(e);

            var b = JSON.parse(r.text);

            if(b.error) return fn(new Error('(#'+b.error.code+') '+b.error.type+': '+b.error.message));

            var j = {}; typeof q !== 'string'?b.data.forEach(function(v){ j[v.name] = v.fql_result_set; }):j = b.data;
            
            fn(null, j);
        });
};