import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { Post } from "./entities/post.entity";
import { Like } from "./entities/like.entity";
import { Follower } from "./entities/followers.entity";
import { Comment } from "./entities/comment.entity";
import { CommentLike } from "./entities/like-comment.entity";
import { Notification } from "./entities/notification.entity";
import { Seen } from "./entities/seen.entity";
import { ICreateUser, IUpdateUser } from "./interfaces/user.interface";
import { IPost } from "./interfaces/post.interface";
import { JwtService } from "@nestjs/jwt";
export declare class UserService {
    private readonly userRepository;
    private readonly postRepository;
    private readonly likeRepository;
    private readonly seenRepository;
    private readonly commentRepository;
    private readonly followerRepository;
    private readonly commentLikeRepository;
    private readonly notificationRepository;
    private readonly jwtService;
    constructor(userRepository: Repository<User>, postRepository: Repository<Post>, likeRepository: Repository<Like>, seenRepository: Repository<Seen>, commentRepository: Repository<Comment>, followerRepository: Repository<Follower>, commentLikeRepository: Repository<CommentLike>, notificationRepository: Repository<Notification>, jwtService: JwtService);
    create(details: ICreateUser): Promise<true | BadRequestException>;
    login(username: string, password: string): Promise<UnauthorizedException | {
        email: string;
        id: number;
    }>;
    formatPost(post: any, userId: number): {
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
    };
    putNotification(user: User, notifier: User, text: string): Promise<boolean>;
    notify(type: "like" | "comment" | "follow", user: User, notifier: User): Promise<boolean>;
    createJwt(email: string, id: number): string;
    createPost(details: IPost, userID: number): Promise<void>;
    getPost(userId: number, id: number, skip: number, take: number): Promise<{
        user: {
            fullname: string;
            avatar: string;
        };
        posts: any[];
    }>;
    getPostById(postId: number, userId: number): Promise<{
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
    getComments(postId: number, skip: number, take: number): Promise<{
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
    handleLikes(postId: number, userId: number): Promise<void>;
    handleSeen(postId: number, userId: number): Promise<void>;
    createComment(content: string, userId: number, postId: number): Promise<{
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
    getPostByUserId(userId: number): Promise<Post[]>;
    follow(userId: number, followerId: number): Promise<boolean>;
    getFriendsSuggestion(): Promise<void>;
    getUserDetailsById(userId: number, myId: number): Promise<{
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
    getProfileDetails(id: number): Promise<{
        username: string;
        fullname: string;
        avatar: string;
        url: string;
        bio: string;
    }>;
    checkUsername(id: number, username: string): Promise<boolean>;
    updateProfile(details: IUpdateUser, id: number): Promise<boolean>;
    searchPost(value: string, userId: number): Promise<{
        posts: any[];
    }>;
    searchProfile(value: string): Promise<any[]>;
    search(value: string, tab: string, userId: number): Promise<any[] | {
        posts: any[];
    }>;
    handleCommentLikes(commentId: number, userId: number): Promise<void>;
    getNotification(userId: number): Promise<Notification[]>;
}
