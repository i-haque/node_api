const { appendFile } = require('fs');

function logger(req, res, next) {
  const log = `{ host: ${req.hostname}, path: ${req.path}, method: ${
    req.method
  }, time: ${new Date().toTimeString()}, date: ${new Date().toDateString()}};`;
  appendFile('log.txt', log + '\n', (err) => {});
  next();
}

module.exports = logger;
