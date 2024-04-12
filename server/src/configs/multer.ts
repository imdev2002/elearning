import { mkdirSync } from 'fs';
import multer from 'multer';
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

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: function (req, file, cb) {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
  },
});
export default upload;
