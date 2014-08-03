var express         = require('express');
var router          = express.Router();
var objects         = require('./objects');
var HelperProvider  = require('./helper').HelperProvider;
var helperProvider  = new HelperProvider();
var domains         = null;
var topics          = null;
var articleProvider = objects.articleProvider;

// Initialize varialbe that might be null because of async call to database
function initializeVariable() {
    domains  = objects.domains;
    topics   = objects.topics;
}

// Process topic page request
function processTopicPage(req, pageNum, res) {
    initializeVariable();
    var topicsLength = topics.length;

    // Iterate through the topics array to find the requested topic
    for (var i = 0; i < topicsLength; i++) {
        var topicParam = helperProvider.convertStringToParam(topics[i]['topic']);

        if (topicParam == req.params.topic) {
            renderTopicPage(req, pageNum, topics[i], res);
            return;
        }
    }

    // If there is no topic like requested, redirect to main page
    helperProvider.redirectTo(res, '/');
}

function findTopicsOfArticles(articles, topicsOfArticles, index, res, topic, topics, domains, totalSize, pageNum, displayPages, displayPageLinks) {
    if (index >= articles.length) {
        res.render('index', {
            title:              'Watch Explorer ' + topic['topic']+' Page',
            articles:           articles,
            topics:             topics,
            topicsOfArticles:   topicsOfArticles,
            domains:            domains,
            size:               totalSize,
            curPage:            pageNum,
            displayPages:       displayPages,
            displayPageLinks:   displayPageLinks
        });
        return;
    }

    articleProvider.findTopicsOfArticle(articles[index]['id'], function(error, resultedTopics) {
        topicsOfArticles.push(resultedTopics);
        // Recursive async call
        findTopicsOfArticles(articles, topicsOfArticles, index+1, res, topic, topics, domains, totalSize, pageNum, displayPages, displayPageLinks);
    });
}

// Render topic page given page number, 
function renderTopicPage(req, pageNum, topic, res) {
    articleProvider.findTopicSize(topic['id'], function(error, docs){
        var totalSize = docs[0]['size'];
        var totalPageNum = Math.floor((totalSize-1)/10+1);
        var displayPages = helperProvider.displayPageArray(pageNum, totalPageNum);
        var displayPageLinks = new Array();

        for (var i = 0; i < displayPages.length; i++) {
            displayPageLinks.push("/topic/"+req.params.topic+"/"+displayPages[i]);
        }

        articleProvider.findTopicPage(pageNum, topic['id'], function(error, docs){
            var topicsOfArticles = [];
            findTopicsOfArticles(docs, topicsOfArticles, 0, res, topic, topics, domains, totalSize, pageNum, displayPages, displayPageLinks);    
        })
    })
}

// Return an array of topics with the given prefix
function findTopicsWithPrefix(prefix) {
    initializeVariable();
    var topicsWithPrefix = [];
    var topicsLength = topics.length;
    var count = 0;
    prefix = prefix.toLowerCase();

    // Iterate through array to find topic match with given prefix
    for (var i = 0; i < topicsLength; i++) {
        if (topics[i]['topic'].toLowerCase().indexOf(prefix) == 0) {
            topicsWithPrefix.push(topics[i]);
            count++;
        }

        if (count >= 10) break;
    }

    // If not enough 10, iterate through array to find topic has given prefix has inner substring
    if (count < 10) {
        for (var i = 0; i < topicsLength; i++) {
            if (topics[i]['topic'].toLowerCase().indexOf(prefix) > 0) {
                topicsWithPrefix.push(topics[i]);
                count++;
            }

            if (count >= 10) break;
        }
    }

    return topicsWithPrefix;
}

// Get the main page with a list of topics
router.get('/list', function(req, res) {
    initializeVariable();
    res.render('topic', {
        title:  'Watch Explorer Topic Page',
        topics: topics
    });
});

// Send back json for ajax auto complete search
router.get('/getPrefixTopic/', function(req, res) {
    console.log('2');
    res.json([]); 
});

router.get('/getPrefixTopic/:prefix', function(req, res) {
    console.log('3');
    var prefix = req.params.prefix;
    var topicsWithPrefix = findTopicsWithPrefix(prefix);
    res.json(topicsWithPrefix);
});

// Get topic page
router.get('/:topic', function(req,res){
    console.log('4');
    processTopicPage(req, 1, res);
});

router.get('/:topic/:id', function(req,res){
    console.log('5');
    // Check if page number parameter is a number or not
    if (!isNaN(req.params.id)) {
        processTopicPage(req, parseInt(req.params.id), res);
    } else {
        // If there is no topic like requested, redirect to main page
        helperProvider.redirectTo(res, '/');
    }
});

module.exports = router;