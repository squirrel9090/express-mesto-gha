const wrongRouter = require('express').Router();

wrongRouter.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

module.exports = wrongRouter;
