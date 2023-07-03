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
app.use(router);
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

app.listen(PORT);

