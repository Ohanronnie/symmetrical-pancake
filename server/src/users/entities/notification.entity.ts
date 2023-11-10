import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./user.entity";
@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("text")
  text: string;
  @Column("text")
  name: string;
  @Column("text")
  image: string;
  @ManyToOne((type) => User, (user) => user.notifications)
  user: User;
  @CreateDateColumn({
    type: "timestamp",
    name: "createdAt",
  })
  createdAt: Date;
}
