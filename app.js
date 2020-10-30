#!/usr/bin/env node
const _ = require('lodash');

const express = require('express');
const app = express();
const PORT = 3001;

// error logging
const fs = require('fs');
const { promisify, format } = require('util');
const writeFile = promisify(fs.writeFile);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res, next) => {
  try {
    var ret = {};
    const { payload } = req.body;

    if (_.isEmpty(payload) || !_.isArray(payload))
      return res.status(200).json({
        response: ret,
        message: 'Expect request.body["payload"] to be an array.',
      });

    ret = payload
      .filter((item) => item['episodeCount'] > 0 && item.drm)
      .map((item) => ({
        image: _.isEmpty(item.image) ? undefined : item.image.showImage,
        slug: item.slug,
        title: item.title,
      }));
    return res.json({ response: ret });
  } catch (error) {
    next(error);
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error(`route ${req.url} is not supported`);
  err.status = 404;
  next();
});

// error handler
app.use(async function (err, req, res, next) {
  res.status(err.status || 500);
  console.log('============== Error ===============');
  console.log(err.message);

  msgJsonParsing = 'Could not decode request: JSON parsing failed';
  message = err.type == 'entity.parse.failed' ? msgJsonParsing : err.message;
  res.json({ error: `${message}` });

  const d = new Date();
  var datestring =
    d.getDate() +
    '-' +
    (d.getMonth() + 1) +
    '-' +
    d.getFullYear() +
    ' ' +
    d.getHours() +
    ':' +
    d.getMinutes();
  await writeFile(
    `./log-${datestring}.json`,
    JSON.stringify({ err: err }).replace(/\\n/g, '')
  );
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});

module.exports.app = app;
