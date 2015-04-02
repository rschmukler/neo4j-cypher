var request = require('superagent-bluebird-promise');
var utils = require('./utils.js');


module.exports = Query;

function Query(endpoint, stmt, params) {
  if (Array.isArray(stmt)) {
    stmt = stmt.join('\n');
  }

  utils.logQuery(stmt, params);

  return request.post(endpoint + '/db/data/transaction/commit')
    .set('Accept', 'application/json; charset=UTF-8')
    .set('Content-Type', 'application/json')
    .send({
      statements: [{
        statement: stmt,
        parameters: params
      }]
    })
    .promise().then(utils.parseResults, utils.parseResults);
}

