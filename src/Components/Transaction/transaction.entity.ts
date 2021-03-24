import { AfterInsert, Column, Entity, getRepository, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Account } from '../Account/account.entity'

export enum TransactionType {
    INCOME = "income",
    EXPENSE = "expense"
}

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column({ type: "real" })
    amount: number;

    @Column({ type: "date"})
    date: Date;
    
    @Column({ type: "enum", enum: TransactionType, default: TransactionType.EXPENSE})
    type: TransactionType;

    @ManyToOne(() => Account, account => account.transactions)
    account: number;

    @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @AfterInsert()
    updateBalance() {
        if (this.type === "income") {
            getRepository(Account).increment({id: this.account}, 'balance', this.amount);
        } else {
            getRepository(Account).decrement({id: this.account}, 'balance', this.amount);
        }
    }
}