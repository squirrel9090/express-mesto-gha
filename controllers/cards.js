const cardsModel = require('../models/card');
const { STATUS_CODES } = require('../utils/constants');

const getCards = (req, res) => {
  cardsModel
    .find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
        message: `Возникла ошибка ${err.message}`,
        err: err.message,
        stack: err.stack,
      });
    });
};

const createCards = (req, res) => {
  const { name, link } = req.body;

  cardsModel
    .create({ name, link, owner: req.user._id })
    // вернём записанные в базу данные
    .then((cards) => res.status(STATUS_CODES.OK).send({ data: cards }))
    // данные не записались, вернём ошибку
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
  //
};

const deleteCards = (req, res) => {
  cardsModel
    .findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: 'Нет карточки с таким id' });
      } else if (card.owner.toString() !== req.user._id) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .send({ message: 'Невозможно удалить чужую карточку' });
      } else {
        res.status(STATUS_CODES.OK).send({ data: card });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({
          message: `Возникла ошибка ${err.message}`,
          err: err.message,
          stack: err.stack,
        });
      } else {
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).send({
          message: `Возникла ошибка ${err.message}`,
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const likeCard = (req, res) => {
  cardsModel
    .findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: 'Карточка для добавления лайка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({
          message: `Возникла ошибка ${err.message}`,
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

const dislikeCard = (req, res) => {
  cardsModel
    .findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        res
          .status(STATUS_CODES.NOT_FOUND)
          .send({ message: 'Карточка для удаления лайка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(STATUS_CODES.BAD_REQUEST).send({
          message: `Возникла ошибка ${err.message}`,
          err: err.message,
          stack: err.stack,
        });
      }
    });
};
module.exports = {
  getCards,
  createCards,
  deleteCards,
  likeCard,
  dislikeCard,
};
