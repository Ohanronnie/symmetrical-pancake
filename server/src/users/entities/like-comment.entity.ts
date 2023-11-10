import { PrimaryGeneratedColumn, Column, ManyToOne, Entity } from "typeorm";
import { User } from "./user.entity";
import { Comment } from "./comment.entity";

@Entity()
export class CommentLike {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne((type) => User, (user) => user.commentLikes)
  user: User;
  @ManyToOne((type) => Comment, (comment) => comment.likes)
  comment: Comment;
}
