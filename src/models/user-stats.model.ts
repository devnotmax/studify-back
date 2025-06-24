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

    @Column({ default: 0 })
    currentStreak!: number;

    @Column({ default: 0 })
    longestStreak!: number;

    @Column({ type: 'date', nullable: true })
    lastActivityDate!: Date;

    @ManyToOne(() => User, (user) => user.stats)
    user!: User;
} 