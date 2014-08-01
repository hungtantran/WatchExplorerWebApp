var express         = require('express');
var router          = express.Router();
var objects         = require('./objects');
var HelperProvider  = require('./helper').HelperProvider;
var helperProvider  = new HelperProvider();
var domains         = null;
var topics          = null;
var articleProvider = objects.articleProvider;


// Process topic page request
function processTopicPage(req, pageNum, res) {
    domains  = objects.domains;
    topics   = objects.topics;
    var topicsLength = topics.length;

    // Iterate through the topics array to find the requested topic
    for (var i = 0; i < topicsLength; i++) {
        var topicParam = topics[i]['topic'].toLowerCase();
        topicParam = topicParam.replace(" ","-");
        topicParam = topicParam.replace("--","-");

        if (topicParam == req.params.topic) {
            renderTopicPage(pageNum, topics[i], res);
            return;
        }
    }

    // If there is no topic like requested, redirect to main page
    helperProvider.redirectTo(res, '/');
}

// Render topic page given page number, 
function renderTopicPage(pageNum, topic, res) {
    var totalSize = 0
    

    articleProvider.findTopicSize(topic['id'], function(error, docs){
        totalSize = docs[0]['size']
    })

    articleProvider.findTopicPage(pageNum, topic['id'], function(error,docs){
        res.render('index', {
            title:      'Watch Explorer ' + topic['topic']+' Page',
            articles:   docs,
            topics:     topics,
            domains:    domains,
            size:       totalSize,
            page:       pageNum
        });
    })
}

// Get topic page
router.get('/:topic', function(req,res){
    processTopicPage(req, 1, res);
});

router.get('/:topic/:id', function(req,res){
    // Check if page number parameter is a number or not
    if (!isNaN(req.params.id)) {
        processTopicPage(req, req.params.id, res);
    } else {
        // If there is no topic like requested, redirect to main page
        helperProvider.redirectTo(res, '/');
    }
});

module.exports = router;