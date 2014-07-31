var mysql      = require('mysql');
var globals    = require("./globals");

var connection = mysql.createConnection({
  host     : globals.dbhost,
  user     : globals.dbuser,
  password : globals.dbpassword
});

ArticleProvider = function() {
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

    console.log('Connect to mysql database successfully');
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
ArticleProvider.prototype.findAll = function(callback) {
  this.connection.query('SELECT * FROM article_table', function(err, rows) {
    if (err) {
      callback (err);
    } else {
      console.log(rows);
      callback(null, rows);
    }
  });
};

ArticleProvider.prototype.findPage = function(pageNum, callback) {
  this.connection.query('SELECT * FROM article_table ORDER BY date_created LIMIT '+(pageNum-1)*10+", 10", function(err, rows) {
    if (err) {
      callback (err);
    } else {
      console.log(rows);
      callback(null, rows);
    }
  });
};

exports.ArticleProvider = ArticleProvider;