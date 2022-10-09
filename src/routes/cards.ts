import { Router } from 'express';
import {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} from '../controllers/cards';
import { validationCard, validationId } from '../services/validation';

const router = Router();

router.get('/', getCards);
router.post('/', validationCard, createCard);
router.delete('/:cardId', validationId, deleteCard);
router.put('/:cardId/likes', validationId, likeCard);
router.delete('/:cardId/likes', validationId, dislikeCard);

export default router;
