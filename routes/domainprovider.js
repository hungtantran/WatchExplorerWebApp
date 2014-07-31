var mysql      = require('mysql');
var globals    = require("./globals");

var connection = mysql.createConnection({
  host     : globals.dbhost,
  user     : globals.dbuser,
  password : globals.dbpassword
});

DomainProvider = function() {
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

// Find the size of domain_table
DomainProvider.prototype.findSize = function(callback) {
  this.connection.query('SELECT COUNT(*) AS size FROM domain_table', function(err, rows) {
    if (err) {
      callback (err);
    } else {
      callback(null, rows);
    }
  });
};

// Find all topics from domain_table
DomainProvider.prototype.findAll = function(callback) {
  this.connection.query('SELECT * FROM domain_table ORDER by id', function(err, rows) {
    if (err) {
      callback (err);
    } else {
      callback(null, rows);
    }
  });
};

exports.DomainProvider = DomainProvider;