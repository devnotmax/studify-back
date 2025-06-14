import express from 'express'
import post from './post.route'
import get from './get.route'
import patch from './patch.route'
import put from './put.route'
import deleted from './delete.route'
import authRoutes from '../../routes/auth.routes'

const router = express();

router.use('/post', post)
router.use('/get', get)
router.use('/patch', patch)
router.use('/put', put)
router.use('/delete', deleted)
router.use('/auth', authRoutes)

export default router;