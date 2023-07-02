const router = require('express').Router();
const cardsController = require('../controllers/cards');
const { createCardJoi, checkCardIdJoi } = require('../middlewares/validation');

router.get('/', cardsController.getCards);

router.post('/', createCardJoi, cardsController.createCards);

router.delete('/:id', checkCardIdJoi, cardsController.deleteCards);

router.put('/:id/likes', checkCardIdJoi, cardsController.likeCard);

router.delete('/:id/likes', checkCardIdJoi, cardsController.dislikeCard);

module.exports = router;
