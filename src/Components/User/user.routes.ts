import express from 'express';
import { userAuth } from '../Auth/auth.controller';
import { userProfile } from './user.controller';

const router = express.Router();

router.get('/profile', userAuth, userProfile);

export default router;
