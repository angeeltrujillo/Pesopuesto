import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Transaction } from "../Transaction/transaction.entity";
import { User } from '../User/user.entity'

@Entity()
export class Account {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({nullable: true})
    description: string;

    @Column({ type: 'numeric', default: 0})
    balance: number;

    @ManyToOne(() => User, user => user.accounts)
    user: number;

    @OneToMany( () => Transaction, transaction => transaction.account)
    transactions: Transaction[];

    @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
}