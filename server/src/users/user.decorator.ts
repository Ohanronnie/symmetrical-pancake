import { createParamDecorator, ExecutionContext } from "@nestjs/common";
export interface IUser {
  email: string;
  id: number;
}
export const User = createParamDecorator(
  (value: null, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user as unknown as IUser;
  },
);
