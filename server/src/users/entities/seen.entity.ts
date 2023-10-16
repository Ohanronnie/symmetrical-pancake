import { PrimaryGeneratedColumn, ManyToOne, Entity } from "typeorm";
import { Post } from "./post.entity";
import { User } from "./user.entity";
@Entity()
export class Seen {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne((type) => Post, (post) => post.seen)
  post: Post;
  @ManyToOne((type) => User, (user) => user.seen)
  user: User;
}
