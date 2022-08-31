import { Sequelize, AssociationOptions } from 'sequelize'
import config from 'config'

import logger from './logger'
import { initRestaurant } from '@models/restaurants.model'
import { initCategory } from '@models/categories.model'
import { initDish } from '@models/dishes.model'
import { initCuisine } from '@models/cuisines.model'
import { initRestaurantCuisine } from '@models/restaurant-cuisines.model'
import { initUser } from '@models/users.model'
import { initAdmin } from '@models/admins.model'
import { initManager } from '@models/managers.model'

// Imports above

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
  force = false,
  alter = false
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
const Category = initCategory(sequelize)
const Dish = initDish(sequelize)
const Cuisine = initCuisine(sequelize)
const RestaurantCuisine = initRestaurantCuisine(sequelize)
const User = initUser(sequelize)
const Admin = initAdmin(sequelize)
const Manager = initManager(sequelize)

// associations

// Restaurants m : n Cuisines
Restaurant.associations.Cuisines = Restaurant.belongsToMany(Cuisine, {
  through: RestaurantCuisine,
  foreignKey: 'restId',
})
Cuisine.associations.Restaurants = Cuisine.belongsToMany(Restaurant, {
  through: RestaurantCuisine,
  foreignKey: 'cuisineId',
})

// Restaurants 1 : m Categories
const assOptions: AssociationOptions = {
  foreignKey: {
    name: 'restId',
    allowNull: false,
  },
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE',
}
Restaurant.associations.Categories = Restaurant.hasMany(Category, assOptions)

Category.associations.Restaurant = Category.belongsTo(Restaurant, assOptions)

// Categories 1 : m Dishes
assOptions.foreignKey = {
  name: 'categoryId',
  allowNull: false,
}
Category.associations.Dishes = Category.hasMany(Dish, assOptions)
Dish.associations.Category = Dish.belongsTo(Category, assOptions)

// Admin 1 : 1 User (if User is Admin)
// also there is a check in place to check if Admin is a Manager or not. If they are, it should not allow that
assOptions.foreignKey = {
  name: 'userId',
  allowNull: false,
}
User.associations.Admin = User.hasOne(Admin, assOptions)
Admin.associations.User = Admin.belongsTo(User, assOptions)

// Manager 1 : 1 User (if User is Manager)
// also there is a check in place to check if Admin is a Manager or not. If they are, it should not allow that
assOptions.foreignKey = {
  name: 'userId',
  allowNull: false,
}

User.associations.Manager = User.hasOne(Manager, assOptions)
Manager.associations.User = Manager.belongsTo(User, assOptions)

/**
 * The object where all of the intialised models are stored for later reference.
 */
const models = {
  Restaurant,
  Category,
  Dish,
  Cuisine,
  RestaurantCuisine,
  User,
  Admin,
}

/**
 * The database instance allowing us to access all of the database models and sequelize instance to help us perform all of the business logic.
 */
const db = {
  sequelize,
  models,
}

export { db, checkDBConnection, syncDB }
