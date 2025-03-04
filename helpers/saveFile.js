import fs from 'node:fs/promises';
import path from 'node:path';
import { avatarDir, avatarPath } from '../middlewares/storage.js';

export const saveFile = async originalFile => {
  const { path: temporaryName, filename } = originalFile;
  const filePath = path.join(avatarPath, filename);

  try {
    await fs.rename(temporaryName, filePath);
    return path.join(avatarDir, filename);
  } catch (error) {
    await fs.unlink(temporaryName);
    return next(HttpError(500, error.message));
  }
};
