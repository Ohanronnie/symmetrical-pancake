import { User } from "./user.entity";
import { Comment } from "./comment.entity";
export declare class CommentLike {
    id: number;
    user: User;
    comment: Comment;
}
