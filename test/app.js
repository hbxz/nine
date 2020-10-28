const { describe } = require('mocha');
const supertest = require('supertest');
var app = require('../app');

const _ = require('lodash');

describe('1. On receiving request with empty body', () => {
  var request;
  beforeEach(function () {
    request = supertest(app)
      .get('/')
      .set('Accept', 'application/json')
      .send({});
  });

  it('returns a json response, with HTTP status 400.', (done) => {
    request.expect('Content-Type', /json/).expect(400, done);
  });

  var kResponse = 'response';
  var vResponse = {};
  it(`the response JSON has a key ${kResponse}, the value is ${vResponse}`, (done) => {
    request
      .expect('Content-Type', /json/)
      .expect((res) => {
        if (!(kResponse in res.body))
          throw new Error(`missing ${kResponse} key`);
        if (!_.isObject(res.body[kResponse]))
          throw new Error(`res.body[${kResponse}] is expected to be an object`);
        if (!_.isEmpty(res.body[kResponse]))
          throw new Error(`res.body[${kResponse}] is expected to be empty`);
      })
      .end(done);
  });

  var kMsg = 'message';
  var vMsg = 'Expect request.body["payload"] to be an array.';
  it(`the response JSON has a key ${kMsg}, the value is "${vMsg}"`, (done) => {
    request
      .expect('Content-Type', /json/)
      .expect((res) => {
        if (!(kMsg in res.body)) throw new Error(`missing ${kMsg} key`);
        if (!(res.body[kMsg] === vMsg))
          throw new Error(`res.body[${kMsg}] is expected to be "${vMsg}"`);
      })
      .end(done);
  });
});
