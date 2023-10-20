import { Module, MiddlewareConsumer } from "@nestjs/common";
import { UserModule } from "./users/user.module";
import { AuthModule } from "./auth/auth.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { User } from "./users/entities/user.entity";
import { Post } from "./users/entities/post.entity";
import { Comment } from "./users/entities/comment.entity";
import { Like } from "./users/entities/like.entity";
import { Seen } from "./users/entities/seen.entity";
import { Follower } from "./users/entities/followers.entity";
import { Session } from "./users/entities/session.entity";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "localhost",
      port: 5432,
      username: "root",
      password: "root",
      database: "sphere",
      entities: [User, Post, Like, Comment, Follower, Session, Seen],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
