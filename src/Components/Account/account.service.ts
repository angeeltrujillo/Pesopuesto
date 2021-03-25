import joi from 'joi';
import { getRepository } from 'typeorm';
import { Account } from './account.entity';

export interface IAccount {
    id?: number,
    name?: string,
    description?: string,
    balance?: number,
    user?: number,
    createdAt?: Date
};

export const accountValidator = async (accountDetails: IAccount) => {
    const schema = joi.object().keys({
        name: joi.string().required(),
        description: joi.string(),
        balance: joi.number(),
        user: joi.number().required()
    });
    const validAccount: IAccount = await schema.validateAsync(accountDetails);
    return validAccount;
};

export const saveAccount = async (accountDetails: IAccount) => {
    const result = getRepository(Account).create(accountDetails);
    const account = await getRepository(Account).save(result);
    return account;
};

export const findAccount = async (accountId: number, userId: number) => {
    const account = await getRepository(Account).findOne(accountId, {where: { user: userId}});
    return account;
};

export const findAccountsByUser = async (userId: number) => {
    const accounts = await getRepository(Account).find({where: {user: userId} });
    return accounts;
};

export const upgradeAccount = async (accountId: number, userId: number, accountDetails: IAccount) => {
    const account = await getRepository(Account).update({id: accountId, user: userId}, accountDetails);
    return account;
};

export const removeAccount = async (accountId: number, userId: number) => {
    const account = await getRepository(Account).delete({id: accountId, user: userId});
    return account;
};
