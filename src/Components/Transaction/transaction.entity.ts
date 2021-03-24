import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Account } from '../Account/account.entity'

export enum TransactionType {
    ENTRY = "entry",
    EXIT = "exit"
}

@Entity()
export class Transaction {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    description: string;

    @Column({ type: "money" })
    amount: number;

    @Column({ type: "date"})
    date: Date;
    @Column({ type: "enum", enum: TransactionType})
    type: TransactionType

    @ManyToOne(() => Account, account => account.transactions)
    account: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
}