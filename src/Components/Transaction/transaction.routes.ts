import express from 'express';
import { userAuth } from '../Auth/auth.controller';
import { createTransaction, readTransactions, getTransaction, updateTransaction, deleteTransaction } from '../Transaction/transaction.controller'
const router = express.Router();

router.post('/create', userAuth, createTransaction);
router.get('/read', userAuth, readTransactions);
router.get('/read/:id', userAuth, getTransaction)
router.put('/update/:id', userAuth, updateTransaction);
router.delete('/delete/:id', userAuth, deleteTransaction);

export default router;
