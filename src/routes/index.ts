import { Router } from 'express'
import restRouter from './restaurants.route'

import cuisineRouter from './cuisines.route'
import userRouter from './users.route'

// Imports above

const router = Router()

router.use('/restaurants', restRouter)

router.use('/cuisines', cuisineRouter)

router.use('/users', userRouter)

export default router
