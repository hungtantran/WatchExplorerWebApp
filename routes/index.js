var express             = require('express');
var router              = express.Router();
var HelperProvider      = require('./helper').HelperProvider;
var helperProvider      = new HelperProvider();
var objects             = require('./objects');
var articleProvider     = objects.articleProvider;

// Render main page given page number
function renderMainPage(pageNum, res) {
    var pages     = null;
    var domains   = objects.domains;
    var topics    = objects.topics;

    articleProvider.findSize(function(error, docs){
        var totalSize    = docs[0]['size'];
        var totalPageNum = Math.floor((totalSize-1)/10+1);
        var displayPages = helperProvider.displayPageArray(pageNum, totalPageNum);
        var displayPageLinks = new Array();
        
        for (var i = 0; i < displayPages.length; i++) {
            displayPageLinks.push("/"+displayPages[i]);
        }

        articleProvider.findPage(pageNum, function(error, docs){
            var topicsOfArticles = [];
            findTopicsOfArticles(docs, topicsOfArticles, 0, res, topics, domains, totalSize, pageNum, displayPages, displayPageLinks);    
        })
    })
}

function findTopicsOfArticles(articles, topicsOfArticles, index, res, topics, domains, totalSize, pageNum, displayPages, displayPageLinks) {
    if (index >= articles.length) {
        res.render('index', {
            title:              'Watch Explorer Main Page',
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
        findTopicsOfArticles(articles, topicsOfArticles, index+1, res, topics, domains, totalSize, pageNum, displayPages, displayPageLinks);
    });
}

// Get main page
router.get('/', function(req, res){
    renderMainPage(1, res);
});

router.get('/:id', function(req, res){
    // Check if the given id is number or not
    if (!isNaN(req.params.id)) {
        renderMainPage(parseInt(req.params.id), res);
    } else {
        // If not, redirect back to main page
        helperProvider.redirectTo(res, '/');
    }
});

module.exports = router;
