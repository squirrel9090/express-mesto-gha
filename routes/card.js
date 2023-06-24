const router = require('express').Router();
const cardsController = require('../controllers/cards');

router.get('/', cardsController.getCards);

router.post('/', cardsController.createCards);

router.delete('/:id', cardsController.deleteCards);

router.put('/:cardId/likes', cardsController.likeCard);

router.delete('/:cardId/likes', cardsController.dislikeCard);

module.exports = router;
