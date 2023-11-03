import { Module } from "@nestjs/common";
import { CloudinaryService } from "./cloudinary.service";
import { Cloudinary } from "./cloudinary";
import { CloudinaryController } from "./cloudinary.controller";

@Module({
  providers: [CloudinaryService, Cloudinary],
  controllers: [CloudinaryController],
})
export class CloudinaryModule {}
