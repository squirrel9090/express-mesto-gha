const cardsModel = require('../models/card');

const getCards = (req, res) => {
  cardsModel
    .find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => {
      res.status(500).send({
        message: 'Произошла ошибка',
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
    .then((cards) => res.send({ data: cards }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      res.status(500).send({
        message: 'Произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
  //
};

const deleteCards = (req, res) => {
  cardsModel
    .findByIdAndRemove(req.params.id)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      res.status(500).send({
        message: 'Произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};
const likeCard = (req, res) => {
  cardsModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      // eslint-disable-next-line comma-dangle
      { new: true }
    )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      res.status(500).send({
        message: 'Произошла ошибка',
        err: err.message,
        stack: err.stack,
      });
    });
};

const dislikeCard = (req, res) => {
  cardsModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      // eslint-disable-next-line comma-dangle
      { new: true }
    )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      res.status(500).send({
        message: 'Произошла ошибка',
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