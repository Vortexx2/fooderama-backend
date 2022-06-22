import { Router } from 'express';
import restRouter from './restaurants';

const router = Router();

router.use('/restaurants', restRouter);

export default router;
