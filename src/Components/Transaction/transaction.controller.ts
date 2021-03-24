import { RequestHandler } from 'express';
import { ITransaction, saveTransaction, transactionValidator } from './transaction.service';

export const createTransaction: RequestHandler = async (req, res, next)  => {
    try {
        const transactionDetails: ITransaction = req.body;
        const validTransaction = await transactionValidator(transactionDetails);
        const transaction = await saveTransaction(validTransaction);
        return res.status(201).json({
            status: 'Sucess',
            data: {
                transaction
            }
        });
    } catch (error) {
        next(error);
    }
};

export const readTransactions: RequestHandler = async (req, res, next)  => {
};

export const getTransaction: RequestHandler = async (req, res, next)  => {
};

export const updateTransaction: RequestHandler = async (req, res, next) => {
};

export const deleteTransaction: RequestHandler = async (req, res, next) => {
};