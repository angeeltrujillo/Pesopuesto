import joi from 'joi';
import { getRepository } from 'typeorm';
import { Account } from '../Account/account.entity';
import { Transaction, TransactionType } from './transaction.entity'

export interface ITransaction {
    id?: number,
    description?: string,
    amount?: number,
    date?: Date,
    type?: TransactionType,
    account?: number,
    user?: number
};

export const dataValidator = async (transactionDetails: ITransaction) => {
    const schema = joi.object().keys({
        description: joi.string().required(),
        amount: joi.number().required(),
        date: joi.date().required(),
        type: joi.string().required(),
        account: joi.number().required(),
        user: joi.number().required()
    });
    const validTransaction: ITransaction = await schema.validateAsync(transactionDetails);
    return validTransaction;
};

export const transactionValidator = async (transactionData: ITransaction) => {
    const validateTransaction = await getRepository(Account).find({where: {id: transactionData.account, user: transactionData.user}});
    if (validateTransaction.length > 0) {
        return transactionData;
    } else {
        return null;
    }
};

export const saveTransaction = async (transactionDetails: ITransaction) => {
    const result = getRepository(Transaction).create(transactionDetails);
    const transaction = await getRepository(Transaction).save(result);
    return transaction;
};

export const findTransactionsByUser = async (userId: number) => {
    const transactions = await getRepository(Transaction).find({ where: { user: userId}})
    return transactions;
};

export const findTransaction = async (transactionId: number, userId: number) => {
    const transaction = await getRepository(Transaction).findOne(transactionId, {where: {user: userId} });
    return transaction;
}

export const upgradeTransaction = async (transactionId: number, userId: number, transactionDetails: ITransaction) => {
    const transaction = await getRepository(Transaction).update({id: transactionId, user: userId}, transactionDetails);
    return transaction;
};

export const removeTransaction = async (transactionId: number, userId: number) => {
    const transaction = await getRepository(Transaction).delete({id: transactionId, user: userId});
    return transaction;
};