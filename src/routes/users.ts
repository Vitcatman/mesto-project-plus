import { Router } from 'express';
import { validationUser, validationAvatar, validationId } from '../services/validation';
import {
  getUsers,
  getUserById,
  getCurrentUser,
  updateUser,
  updateAvatar,
} from '../controllers/users';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', validationId, getUserById);
router.patch('/me', validationUser, updateUser);
router.get('/me', getCurrentUser);
router.patch('/me/avatar', validationAvatar, updateAvatar);

export default router;
