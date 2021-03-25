import { RequestHandler } from 'express';
import {
    findTransactionsByUser,
    ITransaction,
    saveTransaction,
    dataValidator,
    transactionValidator,
    findTransaction,
    upgradeTransaction,
    removeTransaction
} from './transaction.service';
import { IUser } from '../Auth/auth.service';
import { User } from '../User/user.entity';

export const createTransaction: RequestHandler = async (req, res, next)  => {
    try {
        const user: IUser = req.user;
        const userId: number = user.id;
        const transactionDetails: ITransaction = req.body;
        const transactionData = await dataValidator({...transactionDetails, 'user': userId});
        const validTransaction = await transactionValidator(transactionData);
        if (validTransaction) {
            const transaction = await saveTransaction(validTransaction);
            return res.status(201).json({
                status: 'Sucess',
                data: {
                    transaction
                }
            });
        } else {
            return res.status(401).json({
                status: 'Unauthorized',
                data: {
                }
            })
        }
    } catch (error) {
        next(error);
    }
};

export const readTransactions: RequestHandler = async (req, res, next)  => {
    try {
        const user: IUser = req.user;
        const userId: number = user.id;
        const transactions = await findTransactionsByUser(userId);
        return res.status(200).json({
            status: 'Sucess',
            data: {
                transactions
            }
        });
    } catch (error) {
        next(error);
    }
};

export const getTransaction: RequestHandler = async (req, res, next)  => {
    try {
        const user: IUser = req.user;
        const userId: number = user.id;
        const transactionId: number = parseInt(req.params.id, 10);
        const transaction = await findTransaction(transactionId, userId);
        if (transaction) {
            return res.status(200).json({
                status: 'Sucess',
                data: {
                    transaction
                }
            });
        } else {
            return res.status(404).json({
                status: 'Not found',
                data: {
                }
            });
        }
    } catch (error) {
        next(error);
    }
};

export const updateTransaction: RequestHandler = async (req, res, next) => {
    try {
        const user: IUser = req.user;
        const userId: number = user.id;
        const transactionId = parseInt(req.params.id, 10);
        const transactionDetails: ITransaction = req.body;
        const transactionData = await dataValidator({...transactionDetails, 'user': userId });
        const validTransaction = await transactionValidator(transactionData);
        if (validTransaction) {
            const transaction = await upgradeTransaction(transactionId, userId, validTransaction);
            return res.status(200).json({
                status: 'Updated',
                data: {
                }
            });
        } else {
            return res.status(401).json({
                status: 'Unauthorized',
                data: {
                }
            });
        }
    } catch (error) {
        next(error);
    }
};

export const deleteTransaction: RequestHandler = async (req, res, next) => {
    try {
        const user: IUser = req.user;
        const userId: number = user.id;
        const transactionId: number = parseInt(req.params.id, 10);
        const transaction = await removeTransaction(transactionId, userId);
        if (transaction.affected > 0) {
            return res.status(202).json({
                status: 'Deleted',
                data: {
                }
            });
        } else {
            return res.status(404).json({
                status: 'Not found',
                data: {
                }
            });
        }
    } catch (error) {
        next(error);
    }
};