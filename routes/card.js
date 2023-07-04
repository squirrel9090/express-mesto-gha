const router = require('express').Router();
const cardsController = require('../controllers/cards');
const { createCardJoi, checkCardIdJoi } = require('../middlewares/validation');

router.get('/', cardsController.getCards);

router.post('/', createCardJoi, cardsController.createCards);

router.delete('/:cardId', checkCardIdJoi, cardsController.deleteCards);

router.put('/:cardId/likes', checkCardIdJoi, cardsController.likeCard);

router.delete('/:cardId/likes', checkCardIdJoi, cardsController.dislikeCard);

module.exports = router;
