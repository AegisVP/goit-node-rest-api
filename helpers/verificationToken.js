import { v4 } from 'uuid';

export const generateVerificationToken = () => {
  return v4();
};
