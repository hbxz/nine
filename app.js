#!/usr/bin/env node
const _ = require('lodash');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// error logging
const fs = require('fs');
const { promisify, format } = require('util');
const writeFile = promisify(fs.writeFile);

const MSG_JSON_PARSING = 'Could not decode request: JSON parsing failed';

const getDateString = () => {
  const d = new Date();
  return (
    d.getDate() +
    '-' +
    d.getHours() +
    ':' +
    d.getMinutes() +
    ':' +
    d.getSeconds() +
    ':' +
    d.getMilliseconds()
  );
};

const nineHanlder = async (req, res, next) => {
  var ret = {};
  var payload = [];

  await writeFile(
    `./log/log-in-${getDateString()}.json`,
    JSON.stringify({ body: req.body }).replace(/\\n/g, '')
  );

  // JSON parse
  try {
    payload = JSON.parse(req.body).payload;
  } catch (err) {
    err.status = 400;
    err.message = MSG_JSON_PARSING;
    return next(err);
  }

  // corner case: payload empty or is not array
  if (_.isEmpty(payload) || !_.isArray(payload))
    return res.status(200).json({
      response: ret,
      message: 'Expect request.body["payload"] to be an array.',
    });

  // map to result
  ret = payload
    .filter((item) => item['episodeCount'] > 0 && item.drm)
    .map((item) => ({
      image: _.isEmpty(item.image) ? undefined : item.image.showImage,
      slug: item.slug,
      title: item.title,
    }));
  return res.json({ response: ret });
};

const errorHandler = async function (err, req, res, next) {
  if (err.type !== 'entity.parse.failed' && err.status == undefined)
    err.status = 500;

  await writeFile(
    `./log/log-${err.status}-${getDateString()}.json`,
    JSON.stringify({ error: err, body: req.body }).replace(/\\n/g, '')
  );

  return res.status(err.status).json({ error: `${err.message}` });
};

const notFoundHandler = async function (req, res, next) {
  var err = new Error(`route ${req.url} is not supported`);
  err.status = 404;
  next(err);
};

// use bodyParser.text rather than bodyParser.json, for the sake of controling on req.body
app.use(bodyParser.text({ type: '*/*' }));

app.get('/', nineHanlder);
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});

module.exports.app = app;
