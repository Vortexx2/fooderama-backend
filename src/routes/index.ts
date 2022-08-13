import { Router } from 'express'
import restRouter from './restaurants.route'

import cuisineRouter from './cuisines.route'

// Imports above

const router = Router()

router.use('/restaurants', restRouter)

router.use('/cuisines', cuisineRouter)

export default router
