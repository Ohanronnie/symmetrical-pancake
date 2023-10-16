import { diskStorage } from "multer";
import { UnsupportedMediaTypeException } from "@nestjs/common";
export const multerOptions = {
  storage: diskStorage({
    destination: "assets",
    filename: (req, file, cb) => {
      const [name, ext] = file.originalname.split(".");
      const fileName = `${name}${Date.now().toString(32)}.${ext}`;
      cb(null, fileName);
    },
  }),
  limits: {
    fileSize: 1024 * 1024 * 10,
  },
  fileFilter: (req, file, cb) => {
    const fileRegexp = /.(jpeg|jpg|gif|png|webp)$/;
    if (!fileRegexp.test(file.mimetype))
      return cb(
        new UnsupportedMediaTypeException(
          "Only image files (png, jpg, gif, webp) are allowed",
        ),
        false,
      );
    cb(null, true);
  },
};
