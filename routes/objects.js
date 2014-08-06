// Object handle article_table
var ArticleProvider = require('./articleprovider').ArticleProvider;
var articleProvider= new ArticleProvider();

// Helper provider
var HelperProvider  = require('./helper').HelperProvider;
var helperProvider  = new HelperProvider();

// Watch provider
var WatchProvider  = require('./watchprovider').WatchProvider;
var watchProvider  = new WatchProvider();

// Object handle topic_table
var TopicProvider = require('./topicprovider').TopicProvider;
var topicProvider= new TopicProvider();
var topics = null;
topicProvider.findAll(function(error, docs) {
    topics = docs;

    // Add param dimension to topics array
    for (var i = 0; i < topics.length; i++) {
        topics[i]['param'] = helperProvider.convertStringToParam(topics[i]['topic']);
    }

    exports.topics = topics;
})

// Object handle domain_table
var DomainProvider = require('./domainprovider').DomainProvider;
var domainProvider= new DomainProvider();
var domains = null;
domainProvider.findAll(function(error, docs) {
    domains = docs;
    exports.domains = domains;
})

exports.articleProvider = articleProvider;
exports.topicProvider   = topicProvider;
exports.domainProvider  = domainProvider;
exports.watchProvider   = watchProvider;


