const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/users');
const { STATUS_CODES, MONGO_DUPLICATE_KEY_ERROR } = require('../utils/constants');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');

const getUsers = (req, res, next) => {
  userModel
    .find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUsersById = (req, res, next) => {
  userModel
    .findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден');
      } else res.status(STATUS_CODES.OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Введены некорректные данные поиска'));
      }
      return next(err);
    });
};

const createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => userModel
    .create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.status(STATUS_CODES.CREATED).send({
      data: {
        name,
        about,
        avatar,
        email,
      },
    }))
    .catch((err) => {
      if (err.code === MONGO_DUPLICATE_KEY_ERROR) {
        res.status(STATUS_CODES.CONFLICT).send({
          message: `Пользователь с почтой ${email} уже существует `,
          err: err.message,
          stack: err.stack,
        });
        return;
      }
      if (err.name === 'ValidationError') {
        console.log(err);
        res.status(STATUS_CODES.BAD_REQUEST).send({
          message: `Возникла ошибка ${err.message}`,
          err: err.message,
          stack: err.stack,
        });
      } else {
        res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .send({ message: `Возникла ошибка ${err.message}` });
      }
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  userModel.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ _id: token });
    })
    .catch((next));
};

const findCurrentUser = (req, res, next) => {
  userModel.findById(req.user._id)
    .then((user) => {
      if (user) {
        res.status(STATUS_CODES.OK).send({ data: user });
      } else {
        next(new NotFoundError('Пользователь не найден'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Введены некорректные данные поиска'));
      }
      return next(err);
    });
};

const renewUser = (req, res) => {
  const { name, about } = req.body;

  userModel
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => res.status(STATUS_CODES.OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({
          message: `Возникла ошибка ${err.message}`,
          err: err.message,
        });
      } else {
        res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .send({ message: `Возникла ошибка ${err.message}` });
      }
    });
};
const renewUserAvatar = (req, res) => {
  const { avatar } = req.body;

  userModel
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({
          message: `Возникла ошибка ${err.message}`,
          err: err.message,
        });
      } else {
        res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .send({ message: `Возникла ошибка ${err.message}` });
      }
    });
};

module.exports = {
  getUsers,
  getUsersById,
  createUser,
  renewUser,
  renewUserAvatar,
  loginUser,
  findCurrentUser,
};
