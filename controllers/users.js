const userModel = require('../models/users');

const getUsers = (req, res) => {
  userModel
    .find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: `Возникла ошибка ${err.message}`,
        err: err.message,
      });
    });
};

const getUsersById = (req, res) => {
  userModel
    .findById(req.params.user_id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: 'Нет пользователя с таким id' });
      } else res.send({ data: user });
    })
    .catch((err) => {
      res.status(500).send({
        message: `Возникла ошибка ${err.message}`,
        err: err.message,
      });
    });
};

const createUser = (req, res) => {
  userModel
    .create(req.body)
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      res.status(500).send({
        message: `Возникла ошибка ${err.message}`,
        err: err.message,
      });
    });
};
const renewUser = (req, res) => {
  const { name, about, avatar } = req.body;

  userModel
    .findByIdAndUpdate(
      req.params.id,
      { name, about, avatar },
      {
        new: true,
        runValidators: true,
        upsert: true,
        // eslint-disable-next-line comma-dangle
      }
    )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      res.status(500).send({
        message: `Возникла ошибка ${err.message}`,
        err: err.message,
      });
    });
};
const renewUserAvatar = (req, res) => {
  const { avatar } = req.body;

  userModel
    .findByIdAndUpdate(
      req.params.id,
      { avatar },
      {
        new: true,
        runValidators: true,
        upsert: true,
        // eslint-disable-next-line comma-dangle
      }
    )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      res.status(500).send({
        message: `Возникла ошибка ${err.message}`,
        err: err.message,
        stack: err.stack,
      });
    });
};

module.exports = {
  getUsers,
  getUsersById,
  createUser,
  renewUser,
  renewUserAvatar,
};
