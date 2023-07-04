const wrongRouter = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');

wrongRouter.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

module.exports = wrongRouter;
