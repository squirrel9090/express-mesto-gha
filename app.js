const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cardsRouter = require('./routes/card');
const usersRouter = require('./routes/users');

const { PORT = 3000 } = process.env;
const app = express();
app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '649388cfb7bca2aeb868b5e9',
  };

  next();
});

app.listen(PORT, () => {
  console.log('App listening on port 3000');
});
app.use(express.static(path.join(__dirname, 'public')));

app.use('/cards', cardsRouter);
app.use('/users', usersRouter);
