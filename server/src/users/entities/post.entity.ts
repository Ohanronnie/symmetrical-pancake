import {
  ManyToOne,
  OneToMany,
  JoinTable,
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";
import { User } from "./user.entity";
import { IPost } from "../interfaces/post.interface";
import { Like } from "./like.entity";
import { Comment } from "./comment.entity";
import { Seen } from "./seen.entity";
@Entity()
export class Post {
  @PrimaryGeneratedColumn()
  id: number;
  @Column("text")
  type: "image" | "video" | "text";
  @Column("text")
  content: string;
  @Column({ type: "text", nullable: true })
  url?: string | null;
  @OneToMany((type) => Like, (like) => like.post)
  likes: Like[];
  @OneToMany((type) => Comment, (comment) => comment.post)
  comments: Comment[];
  @OneToMany((type) => Seen, (seen) => seen.post)
  seen: Seen[];
  @ManyToOne((type) => User, (user) => user.posts)
  user: User;
  @Column({ type: "timestamp", default: new Date() })
  createdAt: Date;
}
