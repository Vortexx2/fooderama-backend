import { app, config } from './app';
import logger from './logger';

const port: number = config.has('port') ? config.get('port') : 3000;

const server = app.listen(port, () => {
  logger.info(`Listening on port ${port}`);
});
