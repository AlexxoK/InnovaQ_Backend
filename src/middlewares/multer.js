import multer from "multer";
import { dirname, extname, join } from "path";
import { fileURLToPath } from "url";

const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));

const MIMETYPES = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
const MAX_SIZE = 1024 * 1024 * 1024;

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if (MIMETYPES.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error(`Solo se permiten imágenes: ${MIMETYPES.join(", ")}`), false);
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: MAX_SIZE,
    },
});

export const uploadImage  = upload.single("imagen"); 