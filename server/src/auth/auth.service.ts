import { Injectable, HttpException, forwardRef, Inject } from "@nestjs/common";
import { UserService } from "../users/user.service";
import { ICreateUser } from "../users/interfaces/user.interface";
@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}
  async validateUser(username: string, password: string) {
    return this.userService.login(username, password);
  }
  createJwt(email: string, id: number) {
    return this.userService.createJwt(email, id);
  }
  create(user: ICreateUser) {
    return this.userService.create(user);
  }
}
