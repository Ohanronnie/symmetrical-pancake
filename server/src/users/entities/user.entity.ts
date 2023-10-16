import {
  Entity,
  PrimaryGeneratedColumn,
  BeforeInsert,
  CreateDateColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToMany,
} from "typeorm";
import * as bcrypt from "bcryptjs";
import { Post } from "./post.entity";
import { Like } from "./like.entity";
import { Comment } from "./comment.entity";
import { Seen } from "./seen.entity";
import { Follower } from "./followers.entity";
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "text" })
  fullname: string;
  @Column({ type: "text" })
  password: string;
  @Column({ type: "text" })
  username: string;
  @Column({ type: "text" })
  email: string;
  @OneToMany((type) => Follower, (follow) => follow.followers)
  followers: Follower[];
  @OneToMany((type) => Follower, (follow) => follow.following)
  following: Follower[];
  @Column({ type: "text", default: "http://localhost:3000/file/dummy.jpg" })
  avatar: string;
  @CreateDateColumn({
    name: "createdAt",
    type: "timestamp",
  })
  createdAt: Date;
  @OneToMany((type) => Post, (post) => post.user)
  posts: Post[];
  @OneToMany((type) => Like, (like) => like.user)
  likes: Like[];
  @OneToMany((type) => Comment, (comment) => comment.user)
  comments: Comment[];
  @OneToMany((type) => Seen, (seen) => seen.user)
  seen: Post[];
  @BeforeInsert()
  async hashPassword() {
    this.password = bcrypt.hashSync(this.password, 10);
  }
}
