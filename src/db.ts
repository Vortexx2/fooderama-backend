import { Sequelize } from 'sequelize'
import config from 'config'

import logger from './logger'
import { initRestaurant } from '@models/restaurants.model'
import { initMenu } from '@models/menus.model'
import { initCategory } from '@models/categories.model'
import { initDish } from '@models/dishes.model'

interface DatabaseConfig {
  host: string
  port: number
  dbName: string
  username: string
  password: string
}

/**
 * Check if sequelize instance is connected to the specified database.
 * @param seq the sequelize instance
 */
async function checkDBConnection(seq: Sequelize): Promise<void> {
  try {
    await seq.authenticate()
    logger.info('Connected to DB')
  } catch (error) {
    logger.error('Could not connect to DB')
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
    })
    logger.debug('DB has been synced')
  } catch (err) {
    logger.error(err)
  }
}

const dbConfig: DatabaseConfig = config.get('dbConfig')
const { host, port, dbName, username, password } = dbConfig

const sequelize = new Sequelize(dbName, username, password, {
  dialect: 'postgres',
  host,
  port,
  logging: false,
  define: {
    timestamps: true,
    freezeTableName: false,
  },
})

// give the sequelize instance control of all of the models
const Restaurant = initRestaurant(sequelize)
const Menu = initMenu(sequelize)
const Category = initCategory(sequelize)
const Dish = initDish(sequelize)

// associations

Menu.hasMany(Category, {
  foreignKey: {
    name: 'menuId',
    allowNull: false,
  },
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
})
Category.belongsTo(Menu)

Restaurant.hasOne(Menu, {
  foreignKey: {
    name: 'restId',
    allowNull: false,
  },
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
})
Menu.belongsTo(Restaurant)

Category.hasMany(Dish, {
  foreignKey: {
    name: 'categoryId',
    allowNull: false,
  },
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
})
Dish.hasOne(Category)

/**
 * The object where all of the intialised models are stored for later reference.
 */
let models = {
  Restaurant,
  Menu,
  Category,
  Dish,
}

/**
 * The database instance allowing us to access all of the database models and sequelize instance to help us perform all of the business logic.
 */
const db = {
  sequelize,
  models,
}

export { db, checkDBConnection, syncDB }
