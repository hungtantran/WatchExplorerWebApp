var express             = require('express');
var router              = express.Router();
var HelperProvider      = require('./helper').HelperProvider;
var helperProvider      = new HelperProvider();
var objects             = require('./objects');
var articleProvider     = objects.articleProvider;

// Render main page given page number
function renderMainPage(pageNum, res) {
    var totalSize = 0;
    var domains  = objects.domains;
    var topics   = objects.topics;

    articleProvider.findSize(function(error, docs){
        totalSize = docs[0]['size']
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

// Get main page
router.get('/', function(req, res){
    renderMainPage(1, res);
});

router.get('/:id', function(req, res){
    // Check if the given id is number or not
    if (!isNaN(req.params.id)) {
        renderMainPage(req.params.id, res);
    } else {
        // If not, redirect back to main page
        helperProvider.redirectTo(res, '/');
    }
});

module.exports = router;
