const userModel = require('../models/users');
const { STATUS_CODES } = require('../utils/constants');

const getUsers = (req, res) => {
  userModel
    .find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        message: `Возникла ошибка ${err.message}`,
        err: err.message,
      });
    });
};

const getUsersById = (req, res) => {
  userModel
    .findById(req.params.id)
    .then((user) => {
      if (!user) {
        res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: 'Нет пользователя с таким id' });
      } else res.status(STATUS_CODES.OK).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(STATUS_CODES.BAD_REQUEST)
          .send({ message: 'Нет пользователя с таким id' });
      } else {
        res
          .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
          .send({ message: `Возникла ошибка ${err.message}` });
      }
    });
};

const createUser = (req, res) => {
  userModel
    .create(req.body)
    .then((user) => {
      res.status(STATUS_CODES.CREATED).send(user);
    })
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
const renewUser = (req, res) => {
  const { name, about } = req.body;

  userModel
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      {
        new: true,
        runValidators: true,
        // eslint-disable-next-line comma-dangle
      }
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
        // eslint-disable-next-line comma-dangle
      }
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
          .status(STATUS_CODES.BAD_REQUEST)
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
};
