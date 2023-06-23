const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'От 2 до 30 букв'],
    maxlength: [30, 'От 2 до 30 букв'],
    required: true,
  },
  about: {
    type: String,
    minlength: [2, 'От 2 до 30 букв'],
    maxlength: [30, 'От 2 до 30 букв'],
    required: true,
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => /https?:/.test(v),
      message: 'Не соотвествует формату ссылки',
    },

    required: true,
  },
});

module.exports = mongoose.model('user', userSchema);
