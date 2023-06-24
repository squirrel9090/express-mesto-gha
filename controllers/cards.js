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
    .then((cards) => res.status(200).send({ data: cards }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `Возникла ошибка ${err.message}`,
          err: err.message,
        });
      } else {
        res.status(500).send({ message: `Возникла ошибка ${err.message}` });
      }
    });
  //
};

const deleteCards = (req, res) => {
  cardsModel
    .findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: 'Нет карточки с таким id' });
      } else if (card.owner.toString() !== req.user._id) {
        res.status(401).send({ message: 'Невозможно удалить чужую карточку' });
      } else {
        cardsModel
          .findByIdAndRemove(card)
          .then(() => res.status(200).send({ data: card }));
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: `Возникла ошибка ${err.message}`,
        err: err.message,
        stack: err.stack,
      });
    });
};

const likeCard = (req, res) => {
  cardsModel
    .findByIdAndUpdate(
      req.params.id,
      { $addToSet: { likes: req.user._id } },
      // eslint-disable-next-line comma-dangle
      { new: true }
    )
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: 'Карточка для добавления лайка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      res.status(400).send({
        message: `Возникла ошибка ${err.message}`,
        err: err.message,
        stack: err.stack,
      });
    });
};

const dislikeCard = (req, res) => {
  cardsModel
    .findByIdAndUpdate(
      req.params.id,
      { $pull: { likes: req.user._id } },
      // eslint-disable-next-line comma-dangle
      { new: true }
    )
    .then((card) => {
      if (!card) {
        res
          .status(404)
          .send({ message: 'Карточка для удаления лайка не найдена' });
      }
      return res.send(card);
    })
    .catch((err) => {
      res.status(500).send({
        message: `Возникла ошибка ${err.message}`,
        err: err.message,
        stack: err.stack,
      });
    });
};
module.exports = {
  getCards,
  createCards,
  deleteCards,
  likeCard,
  dislikeCard,
};
