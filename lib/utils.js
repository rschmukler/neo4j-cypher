exports.parseResults = function(res) {
  var err;
  if (res.body.results[0]) {
    var columns = res.body.results[0].columns;
    var results = res.body.results[0].data.map(function(data) {
      var result = {};
      columns.forEach(function(col, i) {
        result[col] = data.row[i];
      });
      return result;
    });
    return results.length == 1 ? results[0] : results;
  } else if (err = res.body.errors[0]) {
    var toThrow = new Error(err.message);
    toThrow.code = err.code;
    throw toThrow;
  }
  return undefined;
};
