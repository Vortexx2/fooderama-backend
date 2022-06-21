import { app, config } from './app';

const port: number = config.has('port') ? config.get('port') : 3000;

const server = app.listen(config.get('port'), () => {
  console.log('Listening on port 3000');
});
