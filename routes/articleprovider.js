var mysql      = require('mysql');
var globals    = require("./globals");

var connection = mysql.createConnection({
  host     : globals.dbhost,
  user     : globals.dbuser,
  password : globals.dbpassword
});

ArticleProvider = function() {
  console.log("new object");
  this.connection = mysql.createConnection({
    host     : globals.dbhost,
    user     : globals.dbuser,
    password : globals.dbpassword
  });

  // Start the connection
  this.connection.connect(function(err) {
    if (err) {
      console.error('error connecting: ' + err.stack);
      return;
    }
  });

  // Specify which database to use
  this.connection.query('USE newscrawler', function(err, rows) {
    if (err)
      console.log(err); // 'ER_BAD_DB_ERROR'
  });
};

// Callback function has 2 arguments:
// The first argument is for the error returned (if existed)
// The second argument is for the result

// Find the size of article_table
ArticleProvider.prototype.findSize = function(callback) {
  this.connection.query('SELECT COUNT(*) AS size FROM article_table', function(err, rows) {
    if (err) {
      callback (err);
    } else {
      callback(null, rows);
    }
  });
};

// Find the size of article_table with given topic
ArticleProvider.prototype.findTopicSize = function(topicId, callback) {
  this.connection.query('SELECT COUNT(*) AS size FROM article_table AS A, article_topic_table AS B WHERE A.id = B.article_table_id AND B.topic_table_id = '+topicId, function(err, rows) {
    if (err) {
      callback (err);
    } else {
      callback(null, rows);
    }
  });
};


// Find all articles from article_table
ArticleProvider.prototype.findAll = function(callback) {
  this.connection.query('SELECT * FROM article_table', function(err, rows) {
    if (err) {
      callback (err);
    } else {
      callback(null, rows);
    }
  });
};

// Find 10 articles in given page from article_table
ArticleProvider.prototype.findPage = function(pageNum, callback) {
  this.connection.query('SELECT * FROM article_table ORDER BY date_created DESC, article_name LIMIT '+(pageNum-1)*10+', 10', function(err, rows) {
    if (err) {
      callback (err);
    } else {
      callback(null, rows);
    }
  });
};

// Find 10 articles in given page from article_table with given topic
ArticleProvider.prototype.findTopicPage = function(pageNum, topicId, callback) {
  this.connection.query('SELECT A.id, A.link, A.domain_table_id_1, A.article_name, A.type_table_1, A.date_created, B.article_table_id, B.topic_table_id FROM article_table AS A, article_topic_table AS B WHERE A.id = B.article_table_id AND B.topic_table_id = '+topicId+' ORDER BY date_created DESC, article_name LIMIT '+(pageNum-1)*10+', 10', 
    function(err, rows) {
      if (err) {
        callback (err);
      } else {
        callback(null, rows);
      }
    });
};

// Find all topics of given article_id
ArticleProvider.prototype.findTopicsOfArticle = function(articleId, callback) {
  this.connection.query('SELECT B.topic_table_id FROM article_table AS A, article_topic_table AS B WHERE A.id = '+articleId+' AND A.id = B.article_table_id ORDER BY topic_table_id LIMIT 0,5', 
    function(err, rows) {
      if (err) {
        callback (err);
      } else {
        callback(null, rows);
      }
    });
};

exports.ArticleProvider = ArticleProvider;