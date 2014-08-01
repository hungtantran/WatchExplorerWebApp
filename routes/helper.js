
// HelperProvider constructor
HelperProvider = function() {};

// Function redirect to main page
HelperProvider.prototype.redirectTo = function(res, location) {
    res.writeHead(301, {Location: location});
    res.end();
};

exports.HelperProvider = HelperProvider;