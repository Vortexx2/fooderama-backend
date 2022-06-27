import { app, config } from './app';
import logger from './logger';

const port: number = config.has('port') ? config.get('port') : 3000;
const host: string = config.get('host');

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

const server = app.listen(port, host, () => {
  logger.info(`Listening on port ${port}`);
});
