import joi from 'joi';
import { getRepository } from 'typeorm';
import { IAccount } from '../Account/account.service';
import { Transaction, TransactionType } from './transaction.entity'

export interface ITransaction {
    id?: number,
    description?: string,
    amount?: number,
    date?: Date,
    type?: TransactionType,
    account?: number
};

export const transactionValidator = async (transactionDetails: ITransaction) => {
    const schema = joi.object().keys({
        description: joi.string().required(),
        amount: joi.number().required(),
        date: joi.date().required(),
        type: joi.string().required(),
        account: joi.number().required()
    });
    const validTransaction: IAccount = await schema.validateAsync(transactionDetails);
    return validTransaction;
};

export const saveTransaction = async (transactionDetails: IAccount) => {
    const result = getRepository(Transaction).create(transactionDetails);
    const transaction = await getRepository(Transaction).save(result);
    return transaction;
}
