import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.model";
import { SessionType } from "../types";

@Entity("sessions")
export class Session {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({
    type: "enum",
    enum: SessionType,
  })
  sessionType!: SessionType;

  @Column()
  duration!: number;
  @Column({ default: 0 })
  completedTime!: number;

  @Column({ type: "timestamp" })
  startTime!: Date;

  @Column({ nullable: true, type: "timestamp" })
  endTime!: Date | null;

  @Column()
  userId!: string;

  @Column({ default: false })
  isCompleted!: boolean;

  @Column({ default: false })
  isCancelled!: boolean;

  @Column({ default: false })
  isPaused!: boolean;

  @Column({ default: false })
  isResumed!: boolean;

  @Column({ nullable: true, type: "timestamp" })
  pausedAt?: Date | null;

  @Column({ default: 0, type: "int" })
  elapsedBeforePause!: number;

  @ManyToOne(() => User, (user) => user.sessions)
  user!: User;
}
