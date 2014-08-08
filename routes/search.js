var express         = require('express');
var router          = express.Router();
var objects         = require('./objects');
var articleProvider = objects.articleProvider;
var watchProvider   = objects.watchProvider;
var helperProvider  = objects.helperProvider;

// Get the main page with a list of topics
router.get('/:term', function(req, res) {
    console.log('term = '+req.params);
    res.render('search', {
        title:  'Watch Explorer Search Page',
    });
});

module.exports = router;