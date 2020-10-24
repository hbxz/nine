const { response } = require('express');
const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res, next) => {
  try {
    const { payload } = req.body;

    ret = payload
      .filter((item) => item['episodeCount'] > 0 && item.drm)
      .map((item) => ({
        image: item.image.showImage,
        slug: item.slug,
        title: item.title,
      }));
    res.json({ response: ret });
  } catch (error) {
    next(error);
  }
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

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});
