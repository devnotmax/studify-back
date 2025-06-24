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

  @Column()
  completedTime!: number;

  @Column()
  startTime!: Date;

  @Column()
  endTime!: Date;

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

  @ManyToOne(() => User, (user) => user.sessions)
  user!: User;
}
