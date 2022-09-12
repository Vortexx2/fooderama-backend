import { Router } from 'express'

import restRouter from './restaurants.route'
import cuisineRouter from './cuisines.route'
import userRouter from './users.route'
import categoryRouter from './categories.route'

// Imports above

const router = Router()

router.use('/restaurants', restRouter)

router.use('/cuisines', cuisineRouter)

router.use('/users', userRouter)

router.use('/categories', categoryRouter)

export default router
