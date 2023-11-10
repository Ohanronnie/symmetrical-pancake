import {
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  Entity,
  CreateDateColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Post } from "./post.entity";
import { CommentLike } from "./like-comment.entity";
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
  @OneToMany((type) => CommentLike, (like) => like.comment)
  likes: CommentLike[];
  @CreateDateColumn({
    name: "createdAt",
    type: "timestamp",
  })
  createdAt: Date;
}
