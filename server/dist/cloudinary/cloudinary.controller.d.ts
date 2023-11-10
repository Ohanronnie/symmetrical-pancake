/// <reference types="multer" />
import { CloudinaryService } from "./cloudinary.service";
export declare class CloudinaryController {
    private readonly cloudinaryService;
    constructor(cloudinaryService: CloudinaryService);
    uploadImage(req: Request, file: Express.Multer.File): Promise<unknown>;
}
