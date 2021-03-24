import { RequestHandler } from 'express';
import { User } from '../User/user.entity';
import { Account } from './account.entity';
import { getRepository } from "typeorm";

export const newAccount: RequestHandler = async (req, res, next)  => {
  try {
        const account1 = new Account()
        account1.name = "Santander"
        account1.description = "Cuenta free"
        await getRepository(Account).save(account1)

        const user = new User()
        user.firstName = "Angel"
        user.lastName = "Trujillo"
        user.userName = "angeeltrujillo"
        user.email = "angeeltrujillo@gmail.com"
        user.password = "abc123"
        user.provider = "local"
        user.accounts = [account1]
        await getRepository(User).save(user);
        return res.status(200)

  } catch (err) {
    return next(err);
  }
};

export const allAccounts: RequestHandler = async (req, res, next)  => {
    const users = await getRepository(User).findByIds([1], {relations: ["accounts"] })
    return res.status(200).json(users)
}