var mysql      = require('mysql');
var globals    = require("./globals");

var connection = mysql.createConnection({
  host     : globals.dbhost,
  user     : globals.dbuser,
  password : globals.dbpassword
});

WatchProvider = function() {
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
WatchProvider.prototype.findWatchPriceStat = function(topicId, callback) {
  console.log('SELECT * FROM watch_price_stat_table WHERE topic_table_id = '+topicId);
  this.connection.query('SELECT * FROM watch_price_stat_table WHERE topic_table_id = '+topicId, function(err, rows) {
    if (err) {
      callback (err);
    } else {
      console.log('Get result back');
      callback(null, rows);
    }
  });
};

exports.WatchProvider = WatchProvider;