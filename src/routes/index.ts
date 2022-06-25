import { Router } from 'express';
import restRouter from './restaurants.route';

const router = Router();

router.use('/restaurants', restRouter);

export default router;
