import { User } from "./user.entity";
export declare class Notification {
    id: number;
    text: string;
    name: string;
    image: string;
    user: User;
    createdAt: Date;
}
