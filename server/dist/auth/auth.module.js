"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const cron_service_1 = require("./cron.service");
const user_module_1 = require("../users/user.module");
const local_strategy_1 = require("./local.strategy");
const passport_1 = require("@nestjs/passport");
const auth_controller_1 = require("./auth.controller");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const user_entity_1 = require("../users/entities/user.entity");
const post_entity_1 = require("../users/entities/post.entity");
const like_entity_1 = require("../users/entities/like.entity");
const comment_entity_1 = require("../users/entities/comment.entity");
const followers_entity_1 = require("../users/entities/followers.entity");
const config_1 = require("@nestjs/config");
const session_entity_1 = require("../users/entities/session.entity");
const seen_entity_1 = require("../users/entities/seen.entity");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule,
            (0, common_1.forwardRef)(() => user_module_1.UserModule),
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
            ]),
        ],
        providers: [auth_service_1.AuthService, cron_service_1.TasksService, local_strategy_1.LocalStrategy],
        controllers: [auth_controller_1.AuthController],
        exports: [auth_service_1.AuthService],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map