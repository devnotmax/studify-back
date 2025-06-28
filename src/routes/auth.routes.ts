import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { checkDatabaseConnection } from '../middlewares/database.middleware';

const router = Router();

// Aplicar middleware de verificación de base de datos a todas las rutas de auth
router.use(checkDatabaseConnection);

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

export default router; 