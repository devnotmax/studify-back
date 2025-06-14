import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Session } from "./session.model";
import { UserStats } from "./user-stats.model";
import { IUser } from "../interfaces/user.interface";

@Entity("users")
export class User implements IUser {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  @Column()
  birthDate!: Date;

  @Column({
    type: "enum",
    enum: ["user", "admin"],
    default: "user",
  })
  role!: "user" | "admin";

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => Session, (session) => session.user)
  sessions!: Session[];

  @OneToMany(() => UserStats, (stats) => stats.user)
  stats!: UserStats[];  
}
