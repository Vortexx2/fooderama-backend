import config from 'config'
import { createApp } from '@utils/server'
// imports above

const app = createApp(config)

export { app, config }
