import { Sequelize } from 'sequelize';
import config from 'config';
import logger from './logger';

interface DatabaseConfig {
  host: string;
  port: number;
  dbName: string;
  username: string;
  password: string;
}

const dbConfig: DatabaseConfig = config.get('dbConfig');
const { host, port, dbName, username, password } = dbConfig;

class SequelizeInstance {
  sequelize: Sequelize;

  constructor() {
    this.sequelize = new Sequelize(dbName, username, password, {
      dialect: 'postgres',
      host,
      port,
      logging: (msg: string) => logger.debug(msg),
      define: {
        freezeTableName: true,
      },
    });

    this.checkConnection();
  }

  private async checkConnection(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      logger.info('Connected to DB');
    } catch (error) {
      logger.error('Unable to connect to DB', error);
    }
  }
}

export { SequelizeInstance };
