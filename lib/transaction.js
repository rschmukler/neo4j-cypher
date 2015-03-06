var request = require('superagent-bluebird-promise');

var utils = require('./utils.js');

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

  return buildRequest(this._endpoint + '/db/data/transaction/' + this._txId)
    .send({
      statements: [{
        statement: stmt,
        parameters: params
      }]
    }).promise().then(utils.parseResults);
};

Transaction.prototype.rollback = function() {
  return request.del(this._endpoint + '/db/data/transaction/' + this._txId)
    .set('Accept', 'application/json; charset=UTF-8')
    .set('Content-Type', 'application/json')
    .promise();
};

function buildRequest(url) {
  return request.post(url)
    .set('Accept', 'application/json; charset=UTF-8')
    .set('Content-Type', 'application/json');
}

