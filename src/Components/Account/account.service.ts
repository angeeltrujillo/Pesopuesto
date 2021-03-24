import joi from 'joi';
import { getRepository } from 'typeorm';
import { Account } from './account.entity';

export interface IAccount {
    id?: number,
    name?: string, 
    description?: string,
    balance?: number,
    user: number,
    createdAt?: Date
}

export const accountValidator = async (accountDetails: IAccount) => {
    const schema = joi.object().keys({
        name: joi.string().required(),
        description: joi.string(),
        user: joi.number().required()
    });
    const validAccount: IAccount = await schema.validateAsync(accountDetails);
    return validAccount;
}

export const saveAccount = async (accountDetails: IAccount) => {
    const result = getRepository(Account).create(accountDetails);
    const account = await getRepository(Account).save(result);
    return account;
}

export const findAccount = async (id: number) => {
    const account = await getRepository(Account).findOne(id);
    return account;
}