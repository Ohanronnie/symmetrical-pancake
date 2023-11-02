import { Module, forwardRef } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { TasksService } from "./cron.service";
import { UserModule } from "../users/user.module";
import { LocalStrategy } from "./local.strategy";
//import { JwtStrategy } from "./jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
import { TypeOrmModule, InjectRepository } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { User } from "../users/entities/user.entity";
import { Post } from "../users/entities/post.entity";
import { Like } from "../users/entities/like.entity";
import { Comment } from "../users/entities/comment.entity";
import { Follower } from "../users/entities/followers.entity";
import { ConfigService } from "@nestjs/config";
import { Session } from "../users/entities/session.entity";
import { Seen } from "../users/entities/seen.entity";
import * as session from "express-session";
import { TypeormStore } from "connect-typeorm";
import { Repository } from "typeorm";

@Module({
  imports: [
    PassportModule,
    forwardRef(() => UserModule),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get("JWT_EXPIRES_IN"),
        },
      }),
      inject: [ConfigService],
    }),

    TypeOrmModule.forFeature([
      User,
      Post,
      Like,
      Comment,
      Seen,
      Follower,
      Session,
    ]),
  ],
  providers: [AuthService, TasksService, LocalStrategy /*JwtStrategy*/],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
