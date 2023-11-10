import { Post } from "./post.entity";
import { Like } from "./like.entity";
import { Comment } from "./comment.entity";
import { Follower } from "./followers.entity";
import { CommentLike } from "./like-comment.entity";
import { Notification } from "./notification.entity";
export declare class User {
    id: number;
    fullname: string;
    password: string;
    username: string;
    email: string;
    bio: string;
    url: string;
    verified: boolean;
    followers: Follower[];
    following: Follower[];
    avatar: string;
    createdAt: Date;
    posts: Post[];
    likes: Like[];
    comments: Comment[];
    commentLikes: CommentLike[];
    seen: Post[];
    notifications: Notification[];
    hashPassword(): Promise<void>;
}
