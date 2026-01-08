import express from 'express'; 
import eventRouter from './eventRouter.js';
import authRouter from './auth.router.js';
import userRouter from './userRouter.js';

const router = express.Router();

router.use('/', authRouter);
router.use('/users', userRouter);
router.use('/events',eventRouter);

export default router;