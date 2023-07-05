const { STATUS_CODES } = require('../utils/constants');
const cardsModel = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const BadRequestError = require('../errors/BadRequestError');

const getCards = (req, res, next) => {
  cardsModel
    .find({})
    .then((cards) => {
      res.send({ data: cards });
    })
    .catch((err) => next(err));
};

const createCards = (req, res, next) => {
  const { name, link } = req.body;

  cardsModel
    .create({ name, link, owner: req.user._id })
    // вернём записанные в базу данные
    .then((cards) => res.status(STATUS_CODES.OK).send({ data: cards }))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(`Возникла ошибка ${err.message}`));
      }
      return next(err);
    });
  //
};

const deleteCards = (req, res, next) => {
  cardsModel
    .findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Нет карточки с указанным id'));
      }
      if (!card.owner.equals(req.user._id)) {
        return next(new ForbiddenError('Нет прав на удаление карточки'));
      }
      return card.deleteOne().then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные при удаления карточки'));
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => {
  cardsModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка не найдена'));
      }
      return res.status(STATUS_CODES.OK).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(`Возникла ошибка ${err.message}`));
      }
      return next(err);
    });
};

const dislikeCard = (req, res, next) => {
  cardsModel
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка для удаления лайка не найдена'));
      }
      return res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(`Возникла ошибка ${err.message}`));
      }
      return next(err);
    });
};

module.exports = {
  getCards,
  createCards,
  deleteCards,
  likeCard,
  dislikeCard,
};
