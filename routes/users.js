const usersRouter = require('express').Router();
const usersController = require('../controllers/users');

usersRouter.post('/signup', usersController.createUser);
usersRouter.post('/signin', usersController.loginUser);

usersRouter.get('/', usersController.getUsers);

usersRouter.get('/:id', usersController.getUsersById);

usersRouter.patch('/me', usersController.renewUser);
usersRouter.patch('/me/avatar', usersController.renewUserAvatar);

module.exports = usersRouter;
