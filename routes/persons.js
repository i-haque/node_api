const express = require('express');
const router = express.Router();
const { compare, hash, genSalt } = require('bcryptjs');
const Person = require('../models/person');
const asyncWrapper = require('../middleware/asyncWrapper');
const { validateNewUser, login, validateUser } = require('../utils/validation');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');

router.get(
  '/',
  asyncWrapper(async (req, res) => {
    const allPersons = await Person.find().select('name email phone').exec();
    res.json(allPersons);
  })
);

router.get(
  '/about-me',
  auth,
  asyncWrapper((req, res) => {
    res.send(req.body.person);
  })
);

router.get(
  '/:id',
  asyncWrapper(async (req, res) => {
    const person = await Person.findById(req.params.id)
      .select('name email phone')
      .exec();
    if (!person) return res.status(404).send('User not found');
    res.json(person);
  })
);

router.post(
  '/',
  asyncWrapper(async (req, res) => {
    const errorMsg = validateNewUser(req.body);
    if (errorMsg) return res.status(400).send(errorMsg);

    const newPerson = await Person.create(req.body);
    const token = newPerson.generateAuthToken();
    res.set('x-auth-token', token).json(newPerson);
  })
);

router.post(
  '/login',
  asyncWrapper(async (req, res) => {
    const errorMsg = login(req.body);
    if (errorMsg) return res.status(400).send(errorMsg);

    const [person] = await Person.find({ email: req.body.email }).exec();
    if (!person) return res.status(404).send('User not found');

    const verified = await compare(req.body.password, person.password);
    if (verified) {
      const token = person.generateAuthToken();
      return res.set('x-auth-token', token).send('Login successful');
    } else return res.status(400).send('email or password is incorrect');
  })
);

router.put(
  '/:id',
  asyncWrapper(async (req, res) => {
    const errorMsg = validateUser(req.body);
    if (errorMsg) return res.status(400).send(errorMsg);

    const person = await Person.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
      },
      { new: true, runValidators: true }
    ).exec();

    if (!person) return res.status(404).send('User not found');
    res.json(person);
  })
);

router.patch(
  '/change-password/:id',
  asyncWrapper(async (req, res) => {
    // request body {oldPassword: xxxxxx, newPassword:xxxxx}
    //get the user
    const person = await Person.findById(req.params.id).exec();
    if (!person) return res.status(404).send('user does not exist');

    //get the old password and compare it and the get the new password and hash it
    const verified = await compare(req.body.oldPassword, person.password);
    if (!verified) return res.status(404).send('incorrect password');

    const salt = await genSalt(10);
    const hashedPassword = await hash(req.body.newPassword, salt);

    //update the new password in the database
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      { password: hashedPassword },
      { new: true, runValidators: true }
    ).exec();
    res.json(updatedPerson);
  })
);

router.delete(
  '/:id',
  admin,
  asyncWrapper(async (req, res) => {
    const person = await Person.findByIdAndDelete(req.params.id).exec();
    if (!person) return res.status(404).send('User not found');
    res.json(person);
  })
);

module.exports = router;
