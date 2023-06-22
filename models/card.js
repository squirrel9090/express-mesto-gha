const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: [2, 'От 2 до 30 букв'],
    maxlength: [30, 'От 2 до 30 букв'],
    required: true,
  },
  link: {
    required: true,
    validate: {
      validator: (v) => /https?:/.test(v),
      message: 'Не соотвествует формату ссылки',
    },
    type: String,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      default: [],
      required: false,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    required: false,
  },
});

module.exports = mongoose.model('card', cardSchema);
