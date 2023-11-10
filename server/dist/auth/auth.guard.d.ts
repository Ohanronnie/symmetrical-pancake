import { CanActivate, ExecutionContext } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
export declare class JwtAuthGuard implements CanActivate {
    private readonly authService;
    private readonly jwtService;
    constructor(authService: AuthService, jwtService: JwtService);
    canActivate(ctx: ExecutionContext): boolean;
}
