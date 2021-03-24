import express from 'express';
// import { userAuth } from '../Auth/auth.controller';
import { allAccounts, newAccount } from './account.controller'

const router = express.Router();

router.get('/new', newAccount);
router.get('/all', allAccounts)
export default router;
