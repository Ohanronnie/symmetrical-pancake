import { StreamableFile } from "@nestjs/common";
import { Response, Request } from "express";
import { UserService } from "../user.service";
import { IUser } from "../user.decorator";
import { CreatePostDto } from "../dtos/post.dto";
import { UpdateUserDto } from "../dtos/user.dto";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    loginUser(req: Request, res: Response, session: any): Promise<{
        id: any;
        access_token: string;
    }>;
    createPost(body: CreatePostDto, user: IUser): {};
    getPost(user: IUser, body: any): Promise<{
        user: {
            fullname: string;
            avatar: string;
        };
        posts: any[];
    }>;
    getToken(req: Request, session: any): {
        spa: any;
        req_id: any;
        app_associate: any;
    };
    getPostById(query: any, user: IUser): Promise<{
        postId: number;
        fullname: string;
        username: string;
        verified: boolean;
        userID: number;
        type: "text" | "image" | "video";
        likes: number[];
        comments: any[];
        url: string;
        content: string;
        createdAt: Date;
        avatar: string;
        seen: number;
        posterId: number;
    }>;
    handleLike(user: IUser, postId: number): Promise<{}>;
    handleSeen(user: IUser, postId: number): Promise<{}>;
    handleCommentLike(user: IUser, commentId: number): Promise<{}>;
    handleComment(user: IUser, body: any, postId: number): Promise<{
        user: {
            id: number;
            fullname: string;
            username: string;
            avatar: string;
            verified: boolean;
        };
        content: string;
        likes: any[];
    }>;
    getComment(query: any): Promise<{
        id: number;
        content: string;
        createdAt: Date;
        likes: number[];
        user: {
            fullname: string;
            username: string;
            id: number;
            avatar: string;
            verified: boolean;
        };
    }[]>;
    getPostByUserId(user: IUser, userId: number): Promise<import("../entities/post.entity").Post[]>;
    follow(user: IUser, id: number): Promise<boolean>;
    getPostByProfileId(id: number, user: IUser): Promise<{
        fullname: string;
        username: string;
        avatar: string;
        bio: string;
        url: string;
        verified: boolean;
        cover: string;
        followers: number;
        following: number;
        comments: {
            fullname: string;
            username: string;
            verified: boolean;
            avatar: string;
            content: string;
            createdAt: Date;
        }[];
        posts: {
            postId: any;
            fullname: any;
            username: any;
            verified: any;
            userID: number;
            type: any;
            likes: any;
            comments: any;
            content: any;
            createdAt: any;
            url: any;
            avatar: any;
            seen: any;
        }[];
        createdAt: Date;
        isMe: boolean;
        iFollow: boolean;
        can_edit: boolean;
    }>;
    getPersonalDetails(user: IUser): Promise<{
        username: string;
        fullname: string;
        avatar: string;
        url: string;
        bio: string;
    }>;
    updateProfile(user: IUser, body: UpdateUserDto): Promise<boolean>;
    checkUsername(user: IUser, username: string): Promise<boolean>;
    search(value: string, tab: string): any[] | Promise<any[] | {
        posts: any[];
    }>;
    notification(user: IUser): Promise<import("../entities/notification.entity").Notification[]>;
    getFile(name: string): StreamableFile;
}
