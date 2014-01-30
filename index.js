var  agent   = require('superagent')
    ,select  = require('./default/select');
//TODO: Choose better names
//TODO: Make queries configurable

module.exports = Client = function(options) {
    if(!(this instanceof Client)){
        return new Client(options);
    };

    this.options = options?(typeof options === 'string'?{ "token": options }:options):{};
};

Client.prototype._getJson = function(url, qs, fn){
    if(!fn){
        fn = qs;
        qs = {};
    };

    if(this.options.token) qs.access_token = this.options.token;
    // We store the facebook token into the querystring

    agent
        .get(url)
        .query(qs)
        .end(function(e, r){
            if(e) return fn(e);

            try{
                var j = JSON.parse(r.text);
            }catch(e){
                return fn(e);
            };

            fn(null, j);
        });

    //TODO: Remove Superagent
};

Client.prototype.query = function(q, fn){
    var qs = { "q": typeof q === 'string'? q : JSON.stringify(q) };
    // We store the FQL query in the querystring

    // We get the response to the FQL query and standarize the format
    this._getJson('https://graph.facebook.com/fql', qs, function(e, r){
        if(e) return fn(e);

        if(r.error) return fn(new Error('(#'+r.error.code+') '+r.error.type+': '+r.error.message));

        var j = {}; typeof q !== 'string'?r.data.forEach(function(v){ j[v.name] = v.fql_result_set; }):j = r.data;

        fn(null, j);
    });
};


Client.prototype.user = function(q, fn){
    console.log(select.user.length);
    this.query('SELECT '+select.user+' FROM user WHERE username="'+q+'"', function(e, r){
        if(e || !r.length) return fn(e);
        fn(r[0]);
    });

    // NOTE:
    // This is the equivalent of: SELECT * FORM user WHERE username=...
    // BUT security_settings because is broken: 
    // https://developers.facebook.com/x/bugs/208059456059686/

    // You can read about the returned values here
    // https://developers.facebook.com/docs/reference/fql/user/
};

Client.prototype.pageFeedback = function(q, o, fn){
    var  client   = this
        ,messages = [];

    if(!fn){
        fn = o;
        o  = {};
    };

    //TODO: Options about range of times
    
    // We iterate over messages until we get a empty query
    var query = function(t){
        //NOTE: In testing never got more than ~400 comments so 500 seems a number as good as any other 
        client.query('SELECT actor_id, attachment, created_time, message, permalink, post_id, source_id, target_id FROM stream WHERE source_id IN (SELECT page_id FROM page WHERE username="'+q+'") AND created_time<'+t+' AND actor_id!=source_id LIMIT 500', function(e, r){
            if(e || !r.length) return fn(e, messages);
            messages = messages.concat(r);
            query(Math.min.apply(this,r.map(function(v){return v.created_time;})));
        });
    };

    query(Math.floor((new Date())/1000));

    // More fields that could be in this query:
    // https://developers.facebook.com/docs/reference/fql/stream/
    // Thera are some very cool like tags id, places, action_links, share information, tags etc etc...

    // NOTE A dozen FQL bugs should be resolved:
    // https://developers.facebook.com/x/bugs/203565426458434/
    // filter_key='others' doesnt work well too...
};



Client.prototype._page = function(q, fn){
    return fn(new Error('Not implemented yet'));

    this.query('SELECT can_post, name, username, pic, pic_crop, pic_small, pic_square,type,url FROM profile WHERE username="'+q+'"', function(e, r){
        if(e || !r.length) return fn(e);
        //TODO: Finish
        //NOTE: Remember to get type and get most information
        console.log(r);
    });
};



Client.prototype._profile = function(q, fn){
    return fn(new Error('Not implemented yet'));
    var client = this;

    this.query('SELECT id FROM profile WHERE username="'+q+'"', function(e, r){
        if(e || !r.length) return fn(e);

        console.log(r);

        client._getJson('https://graph.facebook.com/'+r[0].id, fn);
        //client[r.type](q,fn);
        //TODO: Finish this method when user, page etc, etc... gets implemented
    });
};


//TODO: Add Mocha tests
//TODO: Think about to remove empty retorned fields