import { CreateUserDto } from "../users/dtos/user.dto";
import { AuthService } from "./auth.service";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    createUser(body: CreateUserDto): Promise<any>;
    Auth(): Promise<{}>;
}
