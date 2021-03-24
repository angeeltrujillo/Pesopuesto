import express from 'express';
import { userAuth } from '../Auth/auth.controller';
import { createAccount, deleteAccount, readAccounts, getAccount, updateAccount } from './account.controller';

const router = express.Router();

router.post('/create', userAuth, createAccount);
router.get('/read', userAuth, readAccounts);
router.get('/read/:id', userAuth, getAccount)
router.put('/update/:id', userAuth, updateAccount);
router.delete('/delete/:id', userAuth, deleteAccount);

export default router;
