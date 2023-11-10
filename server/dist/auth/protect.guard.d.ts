import { ExecutionContext, CanActivate } from "@nestjs/common";
export declare class ProtectGuard implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean;
}
