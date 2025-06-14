import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./user.model";

@Entity("user_stats")
export class UserStats {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    totalSessions!: number;

    @Column()
    totalTime!: number;

    @Column()
    averageSessionDuration!: number;

    @Column()
    longestSession!: number;

    @Column()
    longestSessionDate!: Date;

    @Column()
    totalFocusTime!: number;

    @Column()
    totalBreakTime!: number;

    @Column()
    totalLongBreakTime!: number;

    @ManyToOne(() => User, (user) => user.stats)
    user!: User;
} 