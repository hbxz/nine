const { describe } = require('mocha');
const supertest = require('supertest');
var { app } = require('../app');

const _ = require('lodash');
const fs = require('fs');
const { promisify } = require('util');
const readFile = promisify(fs.readFile);

describe('1. On receiving request with empty body', () => {
  var request;
  beforeEach(function () {
    request = supertest(app)
      .get('/')
      .set('Accept', 'application/json')
      .type('json')
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

describe('2. On recieving request with invalid JSON ', () => {
  var request;
  var brokenRequest;
  beforeEach(async () => {
    brokenRequest = await readFile('broken_request.json', 'utf8');
    request = supertest(app)
      .get('/')
      .set('Accept', 'application/json')
      .type('json')
      .send(brokenRequest);
  });

  it('returns a json response, with HTTP status 400 Bad Request', (done) => {
    request.expect('Content-Type', /json/).expect(400, done);
  });

  var expectedErrorString = 'Could not decode request';
  it(`returns a json response with a error key containing the string "${expectedErrorString}"`, (done) => {
    request
      .expect((res) => {
        if (!('error' in res.body)) throw new Error('missing error key');
        if (!(typeof res.body.error === 'string'))
          throw new Error('res.body.error is not string');
        if (!res.body.error.includes(expectedErrorString))
          throw new Error(
            `res.body.error doesn't contain the string "${expectedErrorString}"`
          );
      })
      .end(done);
  });
});

describe('3. On recieving request with sample JSON', () => {
  var request;
  var sampleRequest;
  var expectedBody;

  beforeEach(async () => {
    sampleRequest = await readFile('sample_request.json', 'utf8');
    var sampleResponse = await readFile('sample_response.json', 'utf8');
    expectedBody = JSON.parse(sampleResponse);

    request = supertest(app)
      .get('/')
      .set('Accept', 'application/json')
      .type('json')
      .send(sampleRequest);
  });

  it('returns a JSON response, with HTTP status 200', (done) => {
    request.expect('Content-Type', /json/).expect(200, done);
  });

  it(`returns a JSON response with exactly same data as the sample response`, (done) => {
    request.expect(expectedBody).end(done);
  });
});
