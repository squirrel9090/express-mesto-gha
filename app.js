const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const auth = require('./middlewares/auth');
const { createUserJoi, loginJoi } = require('./middlewares/validation');
const UnauthorizedError = require('./errors/UnauthorizedError');
const { createUser, loginUser } = require('./controllers/users');
const { STATUS_CODES } = require('./utils/constants');
const router = require('./routes/router');

const { PORT = 3000 } = process.env;
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.post('/signin', loginJoi, loginUser);
app.post('/signup', createUserJoi, createUser);

app.use(auth);
app.use(errors());

app.use((err, req, res, next) => {
  const {
    statusCode = 500,
    message,
  } = err;
  res.status(statusCode)
    .send({
      message: statusCode === 500 ? 'На сервере произошла ошибка' : message,
    });
  next();
});

// eslint-disable-next-line consistent-return
/*app.use((req, res, next) => {
  console.log(req.headers);
  if (!req.headers.authorization) {
    return res.status(STATUS_CODES.UNAUTHORIZED).send({ message: 'Пользователь не авторизован' });
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
});*/

app.listen(PORT);

app.use(router);
