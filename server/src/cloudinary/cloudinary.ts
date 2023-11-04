import { v2 } from "cloudinary";

export const Cloudinary = {
  provide: "CLOUDINARY",
  useFactory: () => {
    return v2.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_KEY,
      api_secret: process.env.CLOUD_SECRET,
    });
  },
};
