const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
const cardsRouter = require('./routes/card');
const usersRouter = require('./routes/users');
const wrongRouter = require('./routes/wrong');

const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '649388cfb7bca2aeb868b5e9',
  };
  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

app.use('/cards', cardsRouter);
app.use('/users', usersRouter);
app.use('/*', wrongRouter);
