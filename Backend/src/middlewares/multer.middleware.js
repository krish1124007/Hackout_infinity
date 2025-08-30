import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "hackathon_uploads",   // Cloudinary folder name
    allowed_formats: ["jpg", "png", "jpeg", "pdf", "mp4"], // allowed files
  },
});

const upload = multer({ storage });

export { upload };
