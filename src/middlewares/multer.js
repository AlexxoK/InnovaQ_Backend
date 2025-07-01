import multer from "multer";

const storage = multer.diskStorage({
  destination: './images',
  filename: function (_req, file, cb) {
    const extension = file.originalname.slice(file.originalname.lastIndexOf('.'));
    cb(null, Date.now() + extension);
  }
});

const upload = multer({ storage });

export default upload.single('imagen');