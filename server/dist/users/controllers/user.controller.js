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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const user_service_1 = require("../user.service");
const user_decorator_1 = require("../user.decorator");
const post_dto_1 = require("../dtos/post.dto");
const user_dto_1 = require("../dtos/user.dto");
const path_1 = require("path");
const fs_1 = require("fs");
const auth_guard_1 = require("../../auth/auth.guard");
const protect_guard_1 = require("../../auth/protect.guard");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async loginUser(req, res, session) {
        const user = req.user;
        session.jwt = this.userService.createJwt(user.email, user.id);
        const date = new Date();
        res.cookie("c_user", user.id, {
            maxAge: date.setFullYear(date.getFullYear() + 1),
            path: "/",
            sameSite: "lax",
            httpOnly: false,
            secure: true,
        });
        return {
            id: user.id,
            access_token: this.userService.createJwt(user.email, user.id),
        };
    }
    createPost(body, user) {
        console.log(body);
        this.userService.createPost(body, user.id);
        return {};
    }
    getPost(user, body) {
        return this.userService.getPost(user.id, body.id, body.skip, body.take);
    }
    getToken(req, session) {
        req.session["ses_spa"] = session.ses_spa;
        req.session["ses_req_id"] = session.ses_req_id;
        req.session["ses_app_associate"] = session.ses_app_associate;
        return {
            spa: req["spa"],
            req_id: req["req_id"],
            app_associate: req["app_associate"],
        };
    }
    getPostById(query, user) {
        return this.userService.getPostById(query.id, user.id);
    }
    async handleLike(user, postId) {
        const like = await this.userService.handleLikes(postId, user.id);
        return {};
    }
    async handleSeen(user, postId) {
        const seen = await this.userService.handleSeen(postId, user.id);
        return {};
    }
    async handleCommentLike(user, commentId) {
        const like = await this.userService.handleCommentLikes(commentId, user.id);
        return {};
    }
    async handleComment(user, body, postId) {
        return await this.userService.createComment(body.content, user.id, postId);
    }
    async getComment(query) {
        return this.userService.getComments(query.postId, query.skip, query.take);
    }
    async getPostByUserId(user, userId) {
        const post = await this.userService.getPostByUserId(userId);
        return post;
    }
    async follow(user, id) {
        return await this.userService.follow(user.id, id);
    }
    async getPostByProfileId(id, user) {
        console.log(id);
        return this.userService.getUserDetailsById(id, user.id);
    }
    getPersonalDetails(user) {
        return this.userService.getProfileDetails(user.id);
    }
    updateProfile(user, body) {
        return this.userService.updateProfile(body, user.id);
    }
    checkUsername(user, username) {
        return this.userService.checkUsername(user.id, username);
    }
    search(value, tab) {
        if (!value || !tab)
            return [];
        return this.userService.search(value, tab.toLowerCase(), 1);
    }
    notification(user) {
        return this.userService.getNotification(user.id);
    }
    getFile(name) {
        return new common_1.StreamableFile((0, fs_1.createReadStream)((0, path_1.join)("assets", name)));
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)("register/login"),
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)("local")),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)({ passthrough: true })),
    __param(2, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "loginUser", null);
__decorate([
    (0, common_1.Post)("post"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [post_dto_1.CreatePostDto, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "createPost", null);
__decorate([
    (0, common_1.Get)("posts"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getPost", null);
__decorate([
    (0, common_1.Get)("token/get"),
    (0, common_1.UseGuards)(protect_guard_1.ProtectGuard),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Session)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getToken", null);
__decorate([
    (0, common_1.Get)("post"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getPostById", null);
__decorate([
    (0, common_1.Post)("post/like/:postId"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)("postId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "handleLike", null);
__decorate([
    (0, common_1.Post)("post/seen/:postId"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)("postId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "handleSeen", null);
__decorate([
    (0, common_1.Post)("post/comment/like/:commentId"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)("commentId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "handleCommentLike", null);
__decorate([
    (0, common_1.Post)("post/comment/:postId"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Param)("postId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "handleComment", null);
__decorate([
    (0, common_1.Get)("post/comments"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getComment", null);
__decorate([
    (0, common_1.Get)("post/user/:userId"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPostByUserId", null);
__decorate([
    (0, common_1.Post)("follow/:id"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "follow", null);
__decorate([
    (0, common_1.Get)("/profile/:id"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getPostByProfileId", null);
__decorate([
    (0, common_1.Get)("personal/profile/details"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getPersonalDetails", null);
__decorate([
    (0, common_1.Post)("personal/profile/update"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Get)("username/exist/:username"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)("username")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "checkUsername", null);
__decorate([
    (0, common_1.Get)("search"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Query)("value")),
    __param(1, (0, common_1.Query)("tab")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "search", null);
__decorate([
    (0, common_1.Get)("notifications"),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "notification", null);
__decorate([
    (0, common_1.Get)("file/:name"),
    __param(0, (0, common_1.Param)("name")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "getFile", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map