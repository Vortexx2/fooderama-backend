import 'tsconfig-paths/register'
// the above package is needed for module aliases to work correctly while using ts-node

import config from 'config'
import createApp from './app'
import logger from './logger'
// Imports above

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise ', p, ' reason: ', reason)
})

createApp(config).then(app => {
  const port: number = config.has('port') ? config.get('port') : 3000
  const host: string = config.get('host')

  app.listen(port, host, () => {
    logger.info(`Listening on port ${port}`)
  })
})
