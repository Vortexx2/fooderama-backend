import { Router } from 'express';

const restRouter = Router();

restRouter.get('/', (req, res, next) => {
  res.send('hello');
});

export default restRouter;
