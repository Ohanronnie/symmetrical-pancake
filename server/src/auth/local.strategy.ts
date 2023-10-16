import { Strategy } from "passport-local";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable, HttpException } from "@nestjs/common";
import { AuthService } from "./auth.service";
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }
  async validate(username: string, password: string) {
    const user = await this.authService.validateUser(username, password);
    if (user instanceof HttpException) throw user;
    return user;
  }
}
