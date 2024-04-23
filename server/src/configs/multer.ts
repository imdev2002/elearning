import multer from 'multer';
import { mkdirSync } from 'fs';

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     mkdirSync('uploads/', { recursive: true });
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     const extension = file.mimetype.split('/')[1];
//     cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension);
//   },
// });

const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    mkdirSync('uploads/', { recursive: true });
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // Create a unique filename to avoid conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = file.mimetype.split('/')[1];
    cb(null, `file-${uniqueSuffix}.${extension}`);
  },
});

const videoUpload = multer({
  storage: videoStorage,
  limits: { fileSize: 1024 * 1024 * 1024 * 3 },
  fileFilter: (req, file, cb: any) => {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'video/mp4',
      'image/jpg',
      'image/gif',
      'video/mov',
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true); // Allow the file
    } else {
      cb(
        new Error(
          'Only JPEG, PNG, JPG, GIF images and MP4, MOV videos are allowed!',
        ),
      );
    }
  },
});

const upload = multer({
  storage: multer.memoryStorage(),
});

export { upload, videoUpload };
