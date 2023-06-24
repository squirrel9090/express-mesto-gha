const router = require('express').Router();
const cardsController = require('../controllers/cards');

router.get('/', cardsController.getCards);

router.post('/', cardsController.createCards);

router.delete('/:id', cardsController.deleteCards);

router.put('/:id/likes', cardsController.likeCard);

router.delete('/:id/likes', cardsController.dislikeCard);

module.exports = router;
