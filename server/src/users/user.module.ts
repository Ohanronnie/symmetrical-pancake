import { Module, MiddlewareConsumer } from "@nestjs/common";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule, InjectRepository } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { User } from "./entities/user.entity";
import { Post } from "./entities/post.entity";
import { Like } from "./entities/like.entity";
import { Comment } from "./entities/comment.entity";
import { Follower } from "./entities/followers.entity";
import { ConfigService } from "@nestjs/config";
import { Session } from "./entities/session.entity";
import { Seen } from "./entities/seen.entity";
import * as session from "express-session";
import { TypeormStore } from "connect-typeorm";
import { Repository } from "typeorm";

@Module({
  imports: [
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
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {
  constructor(
    @InjectRepository(Session)
    private readonly sessionRepository: Repository<Session>,
    private readonly configService: ConfigService,
  ) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        session({
          secret: this.configService.get("SESSION_SECRET"),
          resave: false,
          saveUninitialized: false,
          name: "datr",
          cookie: {
            maxAge: parseInt(this.configService.get("COOKIE_EXPIRESIN")),
            sameSite: "strict",
            httpOnly: false,
            secure: false,
          },
          store: new TypeormStore({
            cleanupLimit: 2,
            limitSubquery: true,
            ttl: 86400,
          }).connect(this.sessionRepository),
        }),
      )
      .forRoutes("*");
  }
}
