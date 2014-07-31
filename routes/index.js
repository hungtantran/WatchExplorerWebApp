var express = require('express');
var router = express.Router();

// Object handle article_table
var ArticleProvider = require('./articleprovider').ArticleProvider;
var articleProvider= new ArticleProvider();

// Object handle topic_table
var TopicProvider = require('./topicprovider').TopicProvider;
var topicProvider= new TopicProvider();
var topics = null;
topicProvider.findAll(function(error, docs) {
    topics = docs;
}
)

// Object handle domain_table
var DomainProvider = require('./domainprovider').DomainProvider;
var domainProvider= new DomainProvider();
var domains = null;
domainProvider.findAll(function(error, docs) {
    domains = docs;
}
)

// Render main page given page number
function renderMainPage(pageNum, res) {
    var totalSize = 0

    articleProvider.findSize(function(error, docs){
        totalSize = docs[0]['size']
        console.log("total size = "+totalSize);
    })

    articleProvider.findPage(pageNum, function(error,docs){
        res.render('index', {
            title:      'Watch Explorer Main Page',
            articles:   docs,
            topics:     topics,
            domains:    domains,
            size:       totalSize,
            page:       pageNum
        });
    })
}

// Get the first page
router.get('/', function(req, res){
    renderMainPage(1, res);
});

// Get each page
router.get('/:id', function(req, res){
    renderMainPage(req.params.id, res);
});

module.exports = router;
