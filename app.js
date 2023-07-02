const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cardsRouter = require('./routes/card');
const usersRouter = require('./routes/users');
const wrongRouter = require('./routes/wrong');
const UnauthorizedError = require('./errors/UnauthorizedError');

const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use((req, res, next) => {
  console.log(req.headers);
  if (!req.headers.authorization) {
    return res.status(401).send({ message: 'Пользователь не авторизован' });
  }

  const token = req.headers.authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  req.user = payload;
  next();
});

app.listen(PORT);

app.use('/cards', cardsRouter);
app.use('/users', usersRouter);
app.use('/*', wrongRouter);
