const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');
const { STATUS_CODES } = require('../utils/constants');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  console.log(req.headers);
  if (!req.headers.authorization) {
    return res.status(STATUS_CODES.UNAUTHORIZED).send({ message: 'Пользователь не авторизован' });
  }

  const token = req.headers.authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }
  req.user = payload;
  next();
};
