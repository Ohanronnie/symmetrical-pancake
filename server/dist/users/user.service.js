"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const post_entity_1 = require("./entities/post.entity");
const like_entity_1 = require("./entities/like.entity");
const followers_entity_1 = require("./entities/followers.entity");
const comment_entity_1 = require("./entities/comment.entity");
const like_comment_entity_1 = require("./entities/like-comment.entity");
const notification_entity_1 = require("./entities/notification.entity");
const seen_entity_1 = require("./entities/seen.entity");
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
let UserService = class UserService {
    constructor(userRepository, postRepository, likeRepository, seenRepository, commentRepository, followerRepository, commentLikeRepository, notificationRepository, jwtService) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
        this.likeRepository = likeRepository;
        this.seenRepository = seenRepository;
        this.commentRepository = commentRepository;
        this.followerRepository = followerRepository;
        this.commentLikeRepository = commentLikeRepository;
        this.notificationRepository = notificationRepository;
        this.jwtService = jwtService;
    }
    async create(details) {
        const emailExists = await this.userRepository.findOneBy({
            email: details.email,
        });
        const userExists = await this.userRepository.findOneBy({
            username: details.username,
        });
        let errors = [];
        if (userExists)
            errors.push("Username already exist");
        if (emailExists)
            errors.push("Email already exist");
        if (errors.length > 0)
            return new common_1.BadRequestException(errors);
        const user = this.userRepository.create(details);
        await this.userRepository.save(user);
        return true;
    }
    async login(username, password) {
        const user = await this.userRepository.findOneBy({ username });
        if (!user)
            return new common_1.UnauthorizedException(["Username/account does not exist"]);
        const passValid = bcrypt.compareSync(password, user.password);
        if (!passValid)
            return new common_1.UnauthorizedException(["Incorrect password"]);
        return {
            email: user.email,
            id: user.id,
        };
    }
    formatPost(post, userId) {
        return {
            postId: post.id,
            fullname: post.user.fullname,
            username: post.user.username,
            verified: post.user.verified,
            userID: userId,
            type: post.type,
            likes: post.likes.map((e) => e.user.id),
            comments: post.comments.map((e) => e.user.id),
            content: post.content,
            createdAt: post.createdAt,
            url: post.url,
            avatar: post.user.avatar,
            seen: post.seen.length,
        };
    }
    async putNotification(user, notifier, text) {
        const notification = this.notificationRepository.create({
            text,
            name: notifier.fullname,
            image: notifier.avatar,
            user,
        });
        await this.notificationRepository.save(notification);
        return true;
    }
    async notify(type, user, notifier) {
        if (user.id === notifier.id)
            return false;
        switch (type) {
            case "like":
                await this.putNotification(user, notifier, `reacted on your post`);
                break;
            case "comment":
                await this.putNotification(user, notifier, `commented on your post`);
                break;
            case "follow":
                await this.putNotification(user, notifier, `followed you`);
                break;
            default:
                return false;
        }
        return true;
    }
    createJwt(email, id) {
        return this.jwtService.sign({ email, id });
    }
    async createPost(details, userID) {
        const user = await this.userRepository.findOneBy({ id: userID });
        let post = this.postRepository.create({
            ...details,
            createdAt: new Date(),
            user: user,
        });
        await this.postRepository.save(post);
    }
    async getPost(userId, id, skip, take) {
        const posts = await this.postRepository.find({
            relations: [
                "likes",
                "comments",
                "user",
                "likes.user",
                "comments.user",
                "seen",
            ],
            where: id
                ? {
                    user: {
                        id,
                    },
                }
                : {},
            skip,
            take,
        });
        const user = await this.userRepository.findOneBy({ id: userId });
        const POST_TO_BE_SENT = [];
        for (let post of posts) {
            POST_TO_BE_SENT.push({
                postId: post.id,
                fullname: post.user.fullname,
                username: post.user.username,
                verified: post.user.verified,
                userID: userId,
                type: post.type,
                likes: post.likes.map((e) => e.user.id),
                comments: post.comments.map((e) => e.user.id),
                content: post.content,
                createdAt: post.createdAt,
                url: post.url,
                avatar: post.user.avatar,
                seen: post.seen.length,
                posterId: post.user.id,
            });
        }
        return {
            user: {
                fullname: user.fullname,
                avatar: user.avatar,
            },
            posts: POST_TO_BE_SENT.sort((a, b) => Math.random() - 0.5),
        };
    }
    async getPostById(postId, userId) {
        const post = await this.postRepository.findOne({
            where: {
                id: postId,
            },
            relations: [
                "likes",
                "comments",
                "user",
                "likes.user",
                "comments.user",
                "seen",
            ],
        });
        if (!post)
            return;
        return {
            postId: post.id,
            fullname: post.user.fullname,
            username: post.user.username,
            verified: post.user.verified,
            userID: userId,
            type: post.type,
            likes: post.likes.map((e) => e.user.id),
            comments: post.comments.map((e) => void 0),
            url: post.url,
            content: post.content,
            createdAt: post.createdAt,
            avatar: post.user.avatar,
            seen: post.seen.length,
            posterId: post.user.id,
        };
    }
    async getComments(postId, skip, take) {
        const comments = await this.commentRepository.find({
            where: {
                post: {
                    id: postId,
                },
            },
            skip: skip,
            take: take,
            relations: ["user", "likes", "likes.user"],
        });
        return comments
            .sort((comment) => Math.random() - 0.5)
            .map((e) => ({
            id: e.id,
            content: e.content,
            createdAt: e.createdAt,
            likes: e.likes.map((c) => c.user.id),
            user: {
                fullname: e.user.fullname,
                username: e.user.username,
                id: e.user.id,
                avatar: e.user.avatar,
                verified: e.user.verified,
            },
        }));
    }
    async handleLikes(postId, userId) {
        const post = await this.postRepository.findOne({
            where: {
                id: postId,
            },
            relations: ["user"],
        });
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user || !post)
            return;
        const likeExist = await this.likeRepository.findOne({
            where: {
                post: {
                    id: postId,
                },
                user: {
                    id: userId,
                },
            },
            loadRelationIds: true,
        });
        if (!likeExist) {
            const newLike = this.likeRepository.create({
                post,
                user,
            });
            await this.likeRepository.save(newLike);
            await this.notify("like", post.user, user);
        }
        else {
            await this.likeRepository.remove(likeExist);
        }
    }
    async handleSeen(postId, userId) {
        const post = await this.postRepository.findOneBy({ id: postId });
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user || !post)
            return;
        const seenExist = await this.seenRepository.findOne({
            where: {
                post: {
                    id: postId,
                },
                user: {
                    id: userId,
                },
            },
            loadRelationIds: true,
        });
        if (!seenExist) {
            const newSeen = this.seenRepository.create({
                post,
                user,
            });
            await this.seenRepository.save(newSeen);
        }
        else {
        }
    }
    async createComment(content, userId, postId) {
        const user = await this.userRepository.findOneBy({
            id: userId,
        });
        const post = await this.postRepository.findOne({
            where: {
                id: postId,
            },
            relations: ["user"],
        });
        const comment = await this.commentRepository.create({
            user,
            post,
            content,
        });
        const _comment = await this.commentRepository.save(comment);
        await this.notify("comment", post.user, user);
        return {
            user: {
                id: user.id,
                fullname: user.fullname,
                username: user.username,
                avatar: user.avatar,
                verified: user.verified,
            },
            content,
            likes: [],
        };
    }
    async getPostByUserId(userId) {
        const user = await this.userRepository.findOneBy({
            id: userId,
        });
        const posts = await this.postRepository.find({
            where: {
                user: {
                    id: user.id,
                },
            },
            relations: ["likes", "comments", "user", "likes.user", "comments.user"],
            loadRelationIds: true,
        });
        return posts;
    }
    async follow(userId, followerId) {
        const following = await this.userRepository.findOne({
            where: {
                id: userId,
            },
            relations: ["following", "following.followers"],
        });
        const followers = await this.userRepository.findOne({
            where: {
                id: followerId,
            },
            relations: ["followers"],
        });
        if (!following.following.find((e) => e.followers.id == followerId)) {
            const done = this.followerRepository.create({
                following,
                followers,
            });
            await this.followerRepository.save(done);
            await this.notify("follow", followers, following);
        }
        else {
            const __user = await this.followerRepository.findOne({
                where: {
                    following: {
                        id: following.id,
                    },
                    followers: {
                        id: followers.id,
                    },
                },
                loadRelationIds: true,
            });
            await this.followerRepository.delete(__user.id);
        }
        return true;
    }
    async getFriendsSuggestion() { }
    async getUserDetailsById(userId, myId) {
        const _user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
            relations: [
                "posts",
                "posts.likes",
                "posts.comments",
                "posts.likes.user",
                "posts.comments.user",
                "posts.user",
                "posts.seen",
                "followers",
                "following",
                "followers.followers",
                "following.following",
                "following.followers",
                "followers.following",
                "comments",
                "comments.post.likes",
                "comments.post.comments",
                "comments.post.likes.user",
                "comments.post.comments.user",
                "comments.post.user",
                "comments.post.seen",
            ],
        });
        const comments = await this.commentRepository.find({
            where: {
                user: {
                    id: userId,
                },
            },
            relations: [
                "post.likes",
                "post.comments",
                "post.likes.user",
                "post.comments.user",
                "post.user",
                "post.seen",
                "user",
            ],
        });
        let _iFollow = _user.followers.find((e) => e.following.id == myId);
        const user = {
            fullname: _user.fullname,
            username: _user.username,
            avatar: _user.avatar,
            bio: _user.bio,
            url: _user.url,
            verified: _user.verified,
            cover: _user.avatar,
            followers: _user.followers.length,
            following: _user.following.length,
            comments: comments.map((comment) => ({
                fullname: comment.user.fullname,
                username: comment.user.username,
                verified: comment.user.verified,
                avatar: comment.user.avatar,
                content: comment.content,
                createdAt: comment.createdAt,
            })),
            posts: _user.posts.map((post) => this.formatPost(post, myId)),
            createdAt: _user.createdAt,
            isMe: _user.id === myId,
            iFollow: !!_iFollow,
            can_edit: _user.id === myId,
        };
        return user;
    }
    async getProfileDetails(id) {
        const user = await this.userRepository.findOneBy({ id });
        return {
            username: user.username,
            fullname: user.fullname,
            avatar: user.avatar,
            url: user.url,
            bio: user.bio,
        };
    }
    async checkUsername(id, username) {
        const user = await this.userRepository.findOneBy({ username });
        if (user) {
            if (user.id == id) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return false;
        }
    }
    async updateProfile(details, id) {
        const user = await this.userRepository.findOneBy({ id });
        user.fullname = details.fullname;
        user.username = details.username;
        user.avatar = details.avatar;
        if (details.url)
            user.url = details.url;
        if (details.bio)
            user.bio = details.bio;
        await this.userRepository.save(user);
        return true;
    }
    async searchPost(value, userId) {
        const posts = await this.postRepository.find({
            relations: [
                "likes",
                "comments",
                "user",
                "likes.user",
                "comments.user",
                "seen",
            ],
        });
        const user = await this.userRepository.findOneBy({ id: userId });
        const POST_TO_BE_SENT = [];
        for (let post of posts) {
            if (post.content.match(new RegExp(value, "ig"))) {
                POST_TO_BE_SENT.push({
                    postId: post.id,
                    fullname: post.user.fullname,
                    username: post.user.username,
                    verified: post.user.verified,
                    userID: userId,
                    type: post.type,
                    likes: post.likes.map((e) => e.user.id),
                    comments: post.comments.map((e) => e.user.id),
                    content: post.content,
                    createdAt: post.createdAt,
                    url: post.url,
                    avatar: post.user.avatar,
                    seen: post.seen.length,
                    posterId: post.user.id,
                });
            }
        }
        return {
            posts: POST_TO_BE_SENT.sort((a, b) => Math.random() - 0.5),
        };
    }
    async searchProfile(value) {
        const users = await this.userRepository.find();
        const result = [];
        for (let user of users) {
            if (user.username.match(new RegExp(value, "i")) ||
                user.fullname.match(new RegExp(value, "i"))) {
                result.push({
                    username: user.username,
                    fullname: user.fullname,
                    verified: user.verified,
                    avatar: user.avatar,
                    id: user.id,
                });
            }
        }
        return result;
    }
    async search(value, tab, userId) {
        if (!value || !tab)
            return [];
        switch (tab) {
            case "post":
                return await this.searchPost(value, userId);
                break;
            case "profile":
                return await this.searchProfile(value);
                break;
            default:
                return await this.searchPost(value, userId);
        }
    }
    async handleCommentLikes(commentId, userId) {
        const comment = await this.commentRepository.findOneBy({ id: commentId });
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user || !comment)
            return;
        const likeExist = await this.commentLikeRepository.findOne({
            where: {
                comment: {
                    id: commentId,
                },
                user: {
                    id: userId,
                },
            },
            loadRelationIds: true,
        });
        if (!likeExist) {
            const newLike = this.commentLikeRepository.create({
                comment,
                user,
            });
            await this.commentLikeRepository.save(newLike);
        }
        else {
            await this.commentLikeRepository.remove(likeExist);
        }
    }
    async getNotification(userId) {
        return await this.notificationRepository.find({
            where: {
                user: {
                    id: userId,
                },
            },
            loadRelationIds: true,
        });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(post_entity_1.Post)),
    __param(2, (0, typeorm_1.InjectRepository)(like_entity_1.Like)),
    __param(3, (0, typeorm_1.InjectRepository)(seen_entity_1.Seen)),
    __param(4, (0, typeorm_1.InjectRepository)(comment_entity_1.Comment)),
    __param(5, (0, typeorm_1.InjectRepository)(followers_entity_1.Follower)),
    __param(6, (0, typeorm_1.InjectRepository)(like_comment_entity_1.CommentLike)),
    __param(7, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService])
], UserService);
//# sourceMappingURL=user.service.js.map