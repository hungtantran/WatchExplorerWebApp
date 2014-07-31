var express = require('express');
var router = express.Router();

var ArticleProvider = require('./articleprovider-mysql').ArticleProvider;
var articleProvider= new ArticleProvider();

router.get('/', function(req, res){
    articleProvider.findPage(1, function(error,docs){
        console.log(docs);
        res.render('index', {
            title: 'Watch Explorer Main Page',
            articles:docs
        });
    })
});

module.exports = router;
