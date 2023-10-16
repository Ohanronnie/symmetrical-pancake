import { PrimaryGeneratedColumn, Column, ManyToOne, Entity } from "typeorm";
import { User } from "./user.entity";
import { Post } from "./post.entity";

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne((type) => User, (user) => user.likes)
  user: User;
  @ManyToOne((type) => Post, (post) => post.likes)
  post: Post;
}
