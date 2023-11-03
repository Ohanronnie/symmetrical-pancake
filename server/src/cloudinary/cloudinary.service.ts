import { Injectable } from "@nestjs/common";
import { UploadApiErrorResponse, UploadApiResponse, v2 } from "cloudinary";
import * as toStream from "streamifier";
import { createReadStream, rmSync } from "fs";
@Injectable()
export class CloudinaryService {
  async uploadImage(file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream((error, result) => {
        if (error) return reject(error);
        rmSync(`assets/${file.filename}`);
        resolve({ path: result.url });
      });

      createReadStream(`assets/${file.filename}`).pipe(upload);
    });
  }
}
