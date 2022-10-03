import { Router } from 'express';
import Users from './users';
import Cards from './cards';

const mainRouter = Router();

mainRouter.use('/users', Users);
mainRouter.use('/cards', Cards);

export default mainRouter;
