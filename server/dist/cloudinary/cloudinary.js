"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cloudinary = void 0;
const cloudinary_1 = require("cloudinary");
exports.Cloudinary = {
    provide: "CLOUDINARY",
    useFactory: () => {
        return cloudinary_1.v2.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.CLOUD_KEY,
            api_secret: process.env.CLOUD_SECRET,
        });
    },
};
//# sourceMappingURL=cloudinary.js.map