var  agent = require('superagent');


module.exports = Client = function(options) {
    if (!(this instanceof Client)) {
        return new Client(options);
    };

    this.options = options?(typeof options === 'string'?{ "token": options }:options):{};
};

Client.prototype.query = function(q, fn){
    // We store the FQL query in the querystring
    var o = { "q": typeof q === 'string'? q : JSON.stringify(q) };

    // We store the facebook token into the querystring
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

Client.prototype.pageFeedback = function(q, fn){
    var  client   = this
        ,messages = [];
    
    // We iterate over messages until we get a empty query
    var query = function(t){
        //NOTE: In testing never got more than ~400 comments so 500 seems a number as good as any other 
        client.query('SELECT like_info, description_tags, comment_info, actor_id, type, message_tags, created_time, message, attachment FROM stream WHERE source_id IN (SELECT page_id FROM page WHERE username="'+q+'") AND created_time<'+t+' AND actor_id!=source_id LIMIT 500', function(e, r){
            if(e || !r.length) return fn(e, messages);
            messages = messages.concat(r);
            query(Math.min.apply(this,r.map(function(v){return v.created_time;})));
        });
    };

    query(Math.floor((new Date())/1000));

    // NOTE A dozen FQL bugs should be resolved:
    // https://developers.facebook.com/x/bugs/203565426458434/
    // filter_key='others' doesnt work well too...
}; 