import { Sequelize } from 'sequelize';
import config from 'config';

import logger from './logger';
import initRestaurant from './models/restaurants/restaurants.model';

interface DatabaseConfig {
  host: string;
  port: number;
  dbName: string;
  username: string;
  password: string;
}

/**
 * Check if sequelize instance is connected to the specified database.
 * @param seq the sequelize instance
 */
async function checkDBConnection(seq: Sequelize): Promise<void> {
  try {
    await seq.authenticate();
    logger.info('Connected to DB');
  } catch (error) {
    logger.error('Could not connect to DB');
  }
}

/**
 * Syncs all models that exist on the given `seq` instance.
 * @param seq sequelize instance
 * @param force sets seq.sync.force to given. Deletes and creates new tables on each restart.
 * @param alter sets seq.sync.alter to given. Deletes and creates new tables only if schema has changed.
 */
async function syncDB(
  seq: Sequelize,
  force: boolean = false,
  alter: boolean = false
): Promise<void> {
  try {
    await seq.sync({
      force,
      alter,
    });
    logger.debug('DB has been synced');
  } catch (err) {
    logger.error(err);
  }
}

const dbConfig: DatabaseConfig = config.get('dbConfig');
const { host, port, dbName, username, password } = dbConfig;

const sequelize = new Sequelize(dbName, username, password, {
  dialect: 'postgres',
  host,
  port,
  logging: false,
  define: {
    timestamps: true,
    freezeTableName: false,
  },
});

// give sequelize instance control of all models
const Restaurant = initRestaurant(sequelize);

export { sequelize, checkDBConnection, syncDB };
