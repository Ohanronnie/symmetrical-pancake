import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserModule } from "../users/user.module";
import { LocalStrategy } from "./local.strategy";
import { JwtStrategy } from "./jwt.strategy";
import { PassportModule } from "@nestjs/passport";
import { AuthController } from "./auth.controller";
@Module({
  imports: [PassportModule, UserModule],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
