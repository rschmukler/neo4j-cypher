var request = require('superagent-bluebird-promise');

module.exports = Transaction;

function Transaction(endpoint) {
  var self = this;
  this._endpoint = endpoint;
  return buildRequest(endpoint + '/db/data/transaction')
    .promise().then(function(res) {
      self._txId = res.body.commit.match(/(\d+)\/commit/)[1];
      return self;
    });
}

Transaction.prototype.commit = function() {
  return buildRequest(this._endpoint + '/db/data/transaction/' + this._txId + '/commit')
  .promise();
};

Transaction.prototype.query = function(stmt, params) {
  if (Array.isArray(stmt)) {
    stmt = stmt.join('\n');
  }
  console.log(stmt);
  return buildRequest(this._endpoint + '/db/data/transaction/' + this._txId)
    .send({
      statements: [{
        statement: stmt,
        parameters: params
      }]
    }).promise().then(parseResults);
};

Transaction.prototype.rollback = function() {
  return request.delete(this._endpoint + '/db/data/transaction/' + this._txId)
    .set('Accept', 'application/json; charset=UTF-8')
    .set('Content-Type', 'application/json');
};

function buildRequest(url) {
  return request.post(url)
    .set('Accept', 'application/json; charset=UTF-8')
    .set('Content-Type', 'application/json');
}

function parseResults(res) {
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
}
