import { Entity, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { User } from "./user.entity";
@Entity()
export class Follower {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne((type) => User, (user) => user.followers)
  followers: User;
  @ManyToOne((type) => User, (user) => user.following)
  following: User;
}
