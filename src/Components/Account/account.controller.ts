import { RequestHandler } from 'express';
import {
    accountValidator,
    findAccount,
    findAccountsByUser,
    IAccount,
    removeAccount,
    saveAccount,
    upgradeAccount
} from './account.service';
import { IUser } from '../Auth/auth.service';

export const createAccount: RequestHandler = async (req, res, next)  => {
    try {
        const user: IUser = req.user;
        const userId = user.id;
        const accountDetails: IAccount = req.body;
        const validAccount = await accountValidator({...accountDetails, 'user': userId});
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
    try {
        const user: IUser = req.user;
        const userId: number = user.id;
        const accounts = await findAccountsByUser(userId);
        if (accounts.length > 0)  {
            return res.status(200).json({
                status: 'Sucess',
                data: {
                    accounts
                }
            });
        } else {
            return res.status(404).json({
                status: 'Not found',
                data: {
                }
            })
        }
    } catch (error) {
        next(error);
    }
};

export const getAccount: RequestHandler = async (req, res, next)  => {
    try {
        const user: IUser = req.user;
        const userId: number = user.id;
        const accountId  = parseInt(req.params.id);
        const account = await findAccount(accountId, userId);
        console.log(account);
        if (account) {
            return res.status(200).json({
                status: 'Sucess',
                data: {
                    account
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

export const updateAccount: RequestHandler = async (req, res, next) => {
    try {
        const user: IUser = req.user;
        const userId = user.id;
        const accountId = parseInt(req.params.id);
        const accountDetails: IAccount = req.body;
        const validAccount = await accountValidator({...accountDetails, 'user': userId});
        const account = await upgradeAccount(accountId, userId, validAccount);
        return res.status(200).json({
            status: 'Updated',
            data: {
            }
        });
    } catch (error) {
        next(error);
    }
};

export const deleteAccount: RequestHandler = async (req, res, next) => {
    try {
        const user: IUser = req.user;
        const userId: number = user.id;
        const accountId: number = parseInt(req.params.id);
        const account = await removeAccount(accountId, userId);
        if (account.affected > 0) {
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