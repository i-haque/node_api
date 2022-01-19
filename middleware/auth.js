const { verify } = require('jsonwebtoken');
const Person = require('../models/person');

async function auth(req, res, next) {
  const token = req.get('x-auth-token');
  if (!token)
    return res.status(401).send('authentication failed. user is not logged in');

  try {
    const { _id } = verify(token, process.env.JWT_KEY);
    req.body.person = await Person.findById(_id)
      .select('name email phone -_id')
      .exec();
    if (!req.body.person) return res.status(403).send('denied');
    next();
  } catch (error) {
    res.send(error.message);
  }
}

module.exports = auth;
