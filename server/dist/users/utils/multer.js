"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multerOptions = void 0;
const multer_1 = require("multer");
const common_1 = require("@nestjs/common");
exports.multerOptions = {
    storage: (0, multer_1.diskStorage)({
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
            return cb(new common_1.UnsupportedMediaTypeException("Only image files (png, jpg, gif, webp) are allowed"), false);
        cb(null, true);
    },
};
//# sourceMappingURL=multer.js.map