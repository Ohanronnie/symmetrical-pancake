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
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const user_controller_1 = require("./controllers/user.controller");
const user_service_1 = require("./user.service");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("./entities/user.entity");
const post_entity_1 = require("./entities/post.entity");
const like_entity_1 = require("./entities/like.entity");
const comment_entity_1 = require("./entities/comment.entity");
const followers_entity_1 = require("./entities/followers.entity");
const config_1 = require("@nestjs/config");
const session_entity_1 = require("./entities/session.entity");
const seen_entity_1 = require("./entities/seen.entity");
const like_comment_entity_1 = require("./entities/like-comment.entity");
const notification_entity_1 = require("./entities/notification.entity");
const session = require("express-session");
const connect_typeorm_1 = require("connect-typeorm");
const typeorm_2 = require("typeorm");
const auth_module_1 = require("../auth/auth.module");
let UserModule = class UserModule {
    constructor(sessionRepository, configService) {
        this.sessionRepository = sessionRepository;
        this.configService = configService;
    }
    configure(consumer) {
        consumer
            .apply(session({
            secret: this.configService.get("SESSION_SECRET"),
            resave: false,
            saveUninitialized: false,
            name: "datr",
            proxy: true,
            cookie: {
                maxAge: 60 * 60 * 24 * 365,
                sameSite: process.env.NODE_ENV === "production" ? "lax" : "lax",
                httpOnly: false,
                secure: process.env.NODE_ENV === "production" ? true : false,
                path: "/",
            },
            store: new connect_typeorm_1.TypeormStore({
                cleanupLimit: 2,
                limitSubquery: true,
                ttl: 86400,
            }).connect(this.sessionRepository),
        }))
            .forRoutes("*");
    }
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            (0, common_1.forwardRef)(() => auth_module_1.AuthModule),
            jwt_1.JwtModule.registerAsync({
                useFactory: (configService) => ({
                    secret: configService.get("JWT_SECRET"),
                    signOptions: {
                        expiresIn: configService.get("JWT_EXPIRES_IN"),
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                post_entity_1.Post,
                like_entity_1.Like,
                comment_entity_1.Comment,
                seen_entity_1.Seen,
                followers_entity_1.Follower,
                session_entity_1.Session,
                like_comment_entity_1.CommentLike,
                notification_entity_1.Notification,
            ]),
        ],
        controllers: [user_controller_1.UserController],
        providers: [user_service_1.UserService],
        exports: [user_service_1.UserService],
    }),
    __param(0, (0, typeorm_1.InjectRepository)(session_entity_1.Session)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        config_1.ConfigService])
], UserModule);
//# sourceMappingURL=user.module.js.map