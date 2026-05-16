import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();
const imageFilter = (req: any, file: any, cb: any) => {
  // Allowed file extensions
  const allowedExtensions = /jpeg|jpg|png|webp/;

  // Allowed mime types
  const allowedMimeTypes = /image\/jpeg|image\/jpg|image\/png|image\/webp/;

  // Check extension name
  const extName = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase(),
  );

  // Check mime type
  const mimeType = allowedMimeTypes.test(file.mimetype);

  if (extName && mimeType) {
    // Accept the file
    return cb(null, true);
  } else {
    // Reject the file and pass an error
    return cb(
      new Error('Only image files (jpg, jpeg, png, webp) are allowed!'),
      false,
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: imageFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

export default upload;
