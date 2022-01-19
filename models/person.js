const { Schema, model } = require('mongoose');
const { genSalt, hash } = require('bcryptjs');
const { sign } = require('jsonwebtoken');

const personSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      maxlength: 255,
      minlength: 3,
      trim: true,
    },
    email: { type: String, required: true, trim: true, unique: true },
    password: { type: String, required: true },
    phone: { type: Number, required: true },
    isAdmin: { type: Boolean, default: false },
  },
  { timestamps: true }
);

personSchema.pre('save', async function () {
  const salt = await genSalt(10);
  this.password = await hash(this.password, salt);
});

personSchema.method('generateAuthToken', function () {
  return sign({ _id: this._id, isAdmin: this.isAdmin }, process.env.JWT_KEY);
});

const Person = model('Person', personSchema);

module.exports = Person;
