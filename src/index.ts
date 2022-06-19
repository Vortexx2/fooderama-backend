import app from './app';

const server = app.listen('3000', () => {
  console.log('Listening on port 3000');
});