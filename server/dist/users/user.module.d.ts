import { MiddlewareConsumer } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Session } from "./entities/session.entity";
import { Repository } from "typeorm";
export declare class UserModule {
    private readonly sessionRepository;
    private readonly configService;
    constructor(sessionRepository: Repository<Session>, configService: ConfigService);
    configure(consumer: MiddlewareConsumer): void;
}
