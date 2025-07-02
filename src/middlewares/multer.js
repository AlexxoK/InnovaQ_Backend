import multer from "multer";
import path from "path";

// Almacenamiento en disco
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./src/images"); // carpeta donde guardarás las imágenes
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueName + ext);
  }
});

// Filtro de archivo: solo permitir jpg, jpeg, png
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if ([".jpg", ".jpeg", ".png"].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Formato de imagen no soportado. Usa JPG, JPEG o PNG."), false);
  }
};

const upload = multer({
  storage,
  fileFilter
});

export default upload;