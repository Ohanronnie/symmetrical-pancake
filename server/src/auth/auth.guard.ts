import { AuthGuard } from "@nestjs/passport";
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { ProtectGuard } from "./protect.guard";
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}
  canActivate(ctx: ExecutionContext) {
    const request = ctx.switchToHttp().getRequest();
    const jwt = request.session.jwt;
    console.log(request, jwt)
    try {
      const payload = this.jwtService.verify(jwt);
      request.user = payload as any;
    } catch (err: any) {
      throw new UnauthorizedException("Unauthorized");
    }
    return true;
  }
}
