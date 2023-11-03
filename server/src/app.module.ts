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
import { ScheduleModule } from "@nestjs/schedule";
import { CloudinaryModule } from './cloudinary/cloudinary.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: "postgres",
          host: configService.get("DATABASE_HOST"),
          port: configService.get("DATABASE_PORT"),
          username: configService.get("DATABASE_USER"),
          password: configService.get("DATABASE_PASSWORD"),
          database: configService.get("DATABASE_NAME"),
          entities: [User, Post, Like, Comment, Follower, Session, Seen],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    CloudinaryModule,
  ],

  controllers: [],
  providers: [],
})
export class AppModule {}
