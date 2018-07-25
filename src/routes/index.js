import express from 'express';
import { userController } from '../controllers';

const router = express.Router();

router.get('/', userController.welcome);

router.post('/login', userController.login);

export default router;
