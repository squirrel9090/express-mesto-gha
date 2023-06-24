const wrongRouter = require('express').Router();
const { STATUS_CODES } = require('../utils/constants');

wrongRouter.use((req, res) => {
  res
    .status(STATUS_CODES.NOT_FOUND)
    .send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = wrongRouter;
