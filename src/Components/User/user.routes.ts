import express from 'express';
import { userAuth } from '../Auth/auth.controller';
import { profile } from './user.controller';

const router = express.Router();

router.get('/profile', userAuth, profile);

export default router;
