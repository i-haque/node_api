function cors(req, res, next) {
  res.set({
    'access-control-allow-origin': '*',
    'access-control-allow-methods': '*',
    'access-control-allow-headers':
      'origin content-type accept x-requested-with',
  });
  next();
}

module.exports = cors;
