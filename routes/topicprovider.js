var mysql      = require('mysql');
var globals    = require("./globals");

var connection = mysql.createConnection({
  host     : globals.dbhost,
  user     : globals.dbuser,
  password : globals.dbpassword
});

TopicProvider = function() {
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

// Find the size of topic_table
TopicProvider.prototype.findSize = function(callback) {
  this.connection.query('SELECT COUNT(*) AS size FROM topic_table', function(err, rows) {
    if (err) {
      callback (err);
    } else {
      callback(null, rows);
    }
  });
};

// Find all topics from topic_table
TopicProvider.prototype.findAll = function(callback) {
  this.connection.query('SELECT * FROM topic_table ORDER by id', function(err, rows) {
    if (err) {
      callback (err);
    } else {
      callback(null, rows);
    }
  });
};

exports.TopicProvider = TopicProvider;