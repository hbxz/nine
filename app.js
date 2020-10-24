const express = require('express');
const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res, next) => {
  ret = {};
  res.json(ret);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  msgJsonParsing = 'Could not decode request: JSON parsing failed';
  message = err.type == 'entity.parse.failed' ? msgJsonParsing : err.message;
  res.json({ error: `${message}` });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
