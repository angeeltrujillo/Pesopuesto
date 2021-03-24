import { RequestHandler } from 'express';
import { accountValidator, findAccount, IAccount, saveAccount } from './account.service';

export const createAccount: RequestHandler = async (req, res, next)  => {
    try {
        const accountDetails: IAccount = req.body;
        const validAccount = await accountValidator(accountDetails);
        const account = await saveAccount(validAccount);
        return res.status(201).json({
            status: 'Sucess',
            data: {
                account
            }
        })
    } catch (error) {
        next(error);
    }
};

export const readAccounts: RequestHandler = async (req, res, next)  => {
};

export const getAccount: RequestHandler = async (req, res, next)  => {
    try {
        const { id } = req.params;
        const account = await findAccount(parseInt(id));
        return res.status(200).json({
            status: 'Sucess',
            data: {
                account
            }
        })
    } catch (error) {
        next(error);
    }

};

export const updateAccount: RequestHandler = async (req, res, next) => {
};

export const deleteAccount: RequestHandler = async (req, res, next) => {
};