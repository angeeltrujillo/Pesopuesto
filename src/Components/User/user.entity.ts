import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Account } from '../Account/account.entity'

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ nullable: true })
    userName: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    password: string;

    @Column({type: "enum", enum: ['local', 'google', 'facebook'] })
    provider: string;

    @Column({ nullable: true })
    providerId: string;

    @Column({ nullable: true })
    photoUrl: string;

    @OneToMany(() => Account, account => account.user)
    accounts: Account[];

    @Column({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;
}