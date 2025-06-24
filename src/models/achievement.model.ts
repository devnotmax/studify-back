import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm";
import { User } from "./user.model";

@Entity()
export class Achievement {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column()
    condition!: string;

    @Column()
    conditionValue!: number;

    @Column({ default: false })
    isCompleted!: boolean;

    @CreateDateColumn()
    completedAt!: Date;

    @ManyToOne(() => User, user => user.achievements)
    user!: User;
} 