import express from 'express'
import post from './post.route'
import get from './get.route'
import patch from './patch.route'
import put from './put.route'
import deleted from './delete.route'
import authRoutes from '../../routes/auth.routes'
import sessionRoutes from '../../routes/session.routes'

const router = express.Router();

// Health check para Render
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

router.use('/post', post)
router.use('/get', get)
router.use('/patch', patch)
router.use('/put', put)
router.use('/delete', deleted)
router.use('/auth', authRoutes)
router.use('/sessions', sessionRoutes)
console.log('Rutas de sesión montadas en /api/sessions')

export default router;