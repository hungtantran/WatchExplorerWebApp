var express = require('express');
var router = express.Router();

var ArticleProvider = require('./articleprovider-mongodb').ArticleProvider;
var articleProvider= new ArticleProvider('localhost', 27017);

router.get('/new', function(req, res) {
    res.render('blog_new', {
        title: 'New Post'
    });
});

router.post('/new', function(req, res){
    articleProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, docs) {
        res.redirect('/')
    });
});

router.get('/:id', function(req, res) {
    articleProvider.findById(req.params.id, function(error, article) {
        res.render('blog_show.jade',
        { locals: {
            title: article.title,
            article:article
        }
        });
    });
});

router.post('/addComment', function(req, res) {
    articleProvider.addCommentToArticle(req.param('_id'), {
        person: req.param('person'),
        comment: req.param('comment'),
        created_at: new Date()
       } , function( error, docs) {
           res.redirect('/blog/' + req.param('_id'))
       });
});

module.exports = router;