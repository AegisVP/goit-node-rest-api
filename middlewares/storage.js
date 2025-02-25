import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs/promises';

export const publicDir = 'public';
export const publicPath = path.join(process.cwd(), 'public');
export const avatarDir = 'avatars';
export const avatarPath = path.join(publicPath, avatarDir);
export const uploadDir = 'temp';
export const uploadPath = path.join(process.cwd(), uploadDir);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

const upload = multer({ storage });

const isAccessible = path => {
  return fs
    .access(path)
    .then(() => true)
    .catch(() => false);
};

const createFolderIfNotExist = async folder => {
  if (!(await isAccessible(folder))) {
    await fs.mkdir(folder);
  }
};

export const verifyDirectories = async () => {
  try {
    await createFolderIfNotExist(uploadPath);
    await createFolderIfNotExist(publicPath);
    await createFolderIfNotExist(avatarPath);
    return true;
  } catch (error) {
    return false;
  }
};

export default upload;
