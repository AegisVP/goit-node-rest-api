import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs/promises';
export const publicDir = path.join(process.cwd(), 'public');
export const avatarDir = path.join(publicDir, 'avatars');
export const uploadDir = path.join(process.cwd(), 'temp');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
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
    await createFolderIfNotExist(uploadDir);
    await createFolderIfNotExist(publicDir);
    await createFolderIfNotExist(avatarDir);
    return true;
  } catch (error) {
    return false;
  }
};

export default upload;
