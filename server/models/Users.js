const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
  state: { type: String, required: true },
  caste: { type: String },
  minority: { type: String },
  gender: { type: String },
  residence: { type: String },
  disabled: {type: String},
  marital_status: {type: String},
  bpl: {type: String},
  employment: {type: String},
  gemployee: {type: String},
  student: {type: String},
  occupation: {type: String},
  prediction: {type: Array}
});

const User = mongoose.model('User', userSchema);
module.exports = User;
