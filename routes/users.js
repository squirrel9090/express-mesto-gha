const usersRouter = require('express').Router();
const usersController = require('../controllers/users');

usersRouter.get('/', usersController.getUsers);

usersRouter.get('/:id', usersController.getUsersById);

usersRouter.post('/', usersController.createUser);
usersRouter.patch('/me', usersController.renewUser);
usersRouter.patch('/me/avatar', usersController.renewUserAvatar);

module.exports = usersRouter;
