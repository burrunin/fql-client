var  agent = require('superagent');


module.exports = Client = function(options) {
    if(!(this instanceof Client)){
        return new Client(options);
    };

    this.options = options?(typeof options === 'string'?{ "token": options }:options):{};
};

Client.prototype.query = function(q, fn){
    var o = { "q": typeof q === 'string'? q : JSON.stringify(q) };
    // We store the FQL query in the querystring


    if(this.options.token) o.access_token = this.options.token;
    // We store the facebook token into the querystring

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

        //TODO: Remove Superagent
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


Client.prototype.user = function(q, fn){
    this.query('SELECT about_me, birthday_date, email, first_name, middle_name, last_name, pic_square, profile_url, sex FROM user WHERE username="'+q+'"', function(e, r){
        if(e || !r.length) return fn(e);
        fn(r[0]);
    });

    // More fields that could be in this query:
    // https://developers.facebook.com/docs/reference/fql/user/
    // Again, lots of cool stuff, age, sex, bigger pictures, location, interest, followers, friends... etc, etc...
};

Client.prototype.page = function(q, fn){
    return fn(new Error('Not implemented yet'));

    this.query('SELECT can_post, name, username, pic, pic_crop, pic_small, pic_square,type,url FROM profile WHERE username="'+q+'"', function(e, r){
        if(e || !r.length) return fn(e);
        //TODO: Finish
        //NOTE: Remember to get type and get most information
        console.log(r);
    });
};



Client.prototype.profile = function(q, fn){
    return fn(new Error('Not implemented yet'));
    var client = this;

    this.query('SELECT can_post, name, username, pic, pic_crop, pic_small, pic_square,type,url FROM profile WHERE username="'+q+'"', function(e, r){
        if(e || !r.length) return fn(e);

        console.log(r);

        //client[r.type](q,fn);
        //TODO: Finish this method when user, page etc, etc... gets implemented
    });
};


//TODO: Add Mocha tests