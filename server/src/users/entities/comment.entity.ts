import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  Entity,
  CreateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Post } from "./post.entity";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("text")
  content: string;
  @ManyToOne((type) => User, (user) => user.comments)
  user: User;
  @ManyToOne((type) => Post, (post) => post.comments)
  post: Post;
  @CreateDateColumn({
    name: "createdAt",
    type: "timestamp",
  })
  createdAt: Date;
}
