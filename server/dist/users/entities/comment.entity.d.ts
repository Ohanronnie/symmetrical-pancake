import { User } from "./user.entity";
import { Post } from "./post.entity";
import { CommentLike } from "./like-comment.entity";
export declare class Comment {
    id: number;
    content: string;
    user: User;
    post: Post;
    likes: CommentLike[];
    createdAt: Date;
}
