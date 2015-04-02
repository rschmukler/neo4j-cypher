var debug = require('debug')('neo4j');

exports.parseResults = function(res) {
  var err;
  if (!res.body) throw res; // Assume we got an error
  if (res.body.results[0]) {
    var columns = res.body.results[0].columns;
    var results = res.body.results[0].data.map(function(data) {
      var result = {};
      columns.forEach(function(col, i) {
        result[col] = data.row[i];
      });
      return result;
    });
    switch (results.length) {
      case 0: return undefined;
      case 1: return results[0];
      default: return results;
    }
  } else if (err = res.body.errors[0]) {
    exports.logError(err.message);
    var toThrow = new Error(err.message);
    toThrow.code = err.code;
    throw toThrow;
  }
  return undefined;
};

exports.logError = function(err) {
  debug('Error\n' + err.message);
};

exports.logQuery = function(stmt, params) {
  debug('Executing Query:\n' + stmt + '\nParameters:\n' + JSON.stringify(params));
};
