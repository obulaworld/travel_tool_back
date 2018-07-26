import express from 'express';
import { userController } from '../controllers';

const router = express.Router();

router.get('/', userController.welcome);

router.post('/login', userController.login);
router.post('/register', userController.register);

export default router;
