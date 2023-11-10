"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        cors: {
            origin: [
                "http://localhost:5173",
                "http://localhost:5173/",
                "https://connect-hub.netlify.app",
                "https://connect-hub.netlify.app/",
                "https://linkhub-b6g4.onrender.com",
                "https://linkhub-b6g4.onrender.com/",
            ],
            methods: ["GET", "POST", "DELETE"],
            credentials: true,
        },
    });
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.use(cookieParser());
    app.set("trust proxy", true);
    await app.listen(process.env.PORT || 3000);
}
bootstrap();
//# sourceMappingURL=main.js.map