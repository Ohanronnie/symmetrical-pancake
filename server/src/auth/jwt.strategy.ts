import { Strategy, ExtractJwt } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get("JWT_SECRET"),
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  validate(payload: any) {
    return { email: payload.email, id: payload.id };
  }
}
