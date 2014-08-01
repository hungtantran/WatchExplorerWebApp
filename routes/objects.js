// Object handle article_table
var ArticleProvider = require('./articleprovider').ArticleProvider;
var articleProvider= new ArticleProvider();

// Object handle topic_table
var TopicProvider = require('./topicprovider').TopicProvider;
var topicProvider= new TopicProvider();
var topics = null;
topicProvider.findAll(function(error, docs) {
    topics = docs;
    exports.topics = topics
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


