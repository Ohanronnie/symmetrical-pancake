import { UserService } from "../users/user.service";
import { ICreateUser } from "../users/interfaces/user.interface";
export declare class AuthService {
    private readonly userService;
    constructor(userService: UserService);
    validateUser(username: string, password: string): Promise<import("@nestjs/common").UnauthorizedException | {
        email: string;
        id: number;
    }>;
    createJwt(email: string, id: number): string;
    create(user: ICreateUser): Promise<true | import("@nestjs/common").BadRequestException>;
}
