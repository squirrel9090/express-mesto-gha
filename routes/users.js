const router = require('express').Router();
const usersController = require('../controllers/users');

router.get('/', usersController.getUsers);

router.get('/:userId', usersController.getUsersById);

router.post('/', usersController.createUser);
router.patch('/:id', usersController.renewUser);
router.patch('/:id/avatar', usersController.renewUserAvatar);

module.exports = router;
