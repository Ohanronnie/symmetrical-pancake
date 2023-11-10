import { User } from "./user.entity";
import { Like } from "./like.entity";
import { Comment } from "./comment.entity";
import { Seen } from "./seen.entity";
export declare class Post {
    id: number;
    type: "image" | "video" | "text";
    content: string;
    url?: string | null;
    likes: Like[];
    comments: Comment[];
    seen: Seen[];
    user: User;
    createdAt: Date;
}
