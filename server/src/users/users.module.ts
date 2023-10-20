import { Module, forwardRef } from "@nestjs/common";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./user.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import { User } from "./entities/user.entity";
import { ConfigService, ConfigModule } from "@nestjs/config";
import { AuthModule } from "../auth/auth.module";
@Module({
  imports: [
    forwardRef(() => AuthModule),
    ConfigModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: {
          expiresIn: configService.get("JWT_EXPIRES_IN"),
        },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
