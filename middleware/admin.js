const { verify } = require('jsonwebtoken');

function admin(req, res, next) {
  const token = req.get('x-auth-token');
  if (!token)
    return res.status(401).send('authentication failed. no token present');

  try {
    const { isAdmin } = verify(token, process.env.JWT_KEY);
    if (isAdmin) next();
    else return res.status(403).send('denied');
  } catch (error) {
    res.send(error.message);
  }
}

module.exports = admin;
