const usersRouter = require('express').Router();
const usersController = require('../controllers/users');

usersRouter.get('/', usersController.getUsers);

usersRouter.get('/:id', usersController.getUsersById);

usersRouter.post('/', usersController.createUser);
usersRouter.patch('/:id', usersController.renewUser);
usersRouter.patch('/:id/avatar', usersController.renewUserAvatar);

module.exports = usersRouter;
