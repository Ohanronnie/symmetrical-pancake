import {
  Controller,
  UseInterceptors,
  Post,
  Req,
  UploadedFile,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "../users/utils/multer";
import { CloudinaryService } from "./cloudinary.service";
@Controller("")
export class CloudinaryController {
  constructor(private readonly cloudinaryService: CloudinaryService) {}
  @Post("image/upload")
  //@UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor("image", multerOptions))
  async uploadImage(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.cloudinaryService.uploadImage(file);
  }
}
