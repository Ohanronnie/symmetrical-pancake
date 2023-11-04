import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ValidationPipe } from "@nestjs/common";
import { AppModule } from "./app.module";
import * as cookieParser from "cookie-parser";
import * as session from "express-session";
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: {
      origin: [
        "http://localhost:5173",
        "http://localhost:5173/",
        "https://connect-hub.netlify.app",
        "https://connect-hub.netlify.app/",
        "https://linkhub-b6g4.onrender.com",
      ],
      methods: ["GET", "POST", "DELETE"],
      credentials: true,
    },
  });
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());
  app.set("trust proxy", true);
  /*app.use(session({
      secret: "JUSTIMAGINEXANDY",
      resave: true,
      saveUninitialized: true,
      name: "datr",
      cookie: {
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "none",
        httpOnly: true,
        secure: true,
        path: "/"
      },
      store: new TypeormStore({
         cleanupLimit: 2,
         limitSubquery: true,
         ttl: 86400,
       }).connect(this.sessionRepository),
    }))*/
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
