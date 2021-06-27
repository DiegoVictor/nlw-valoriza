import { sign } from 'jsonwebtoken';

export default (id: string): string => {
  return sign({}, process.env.JWT_SECRET, {
    subject: id,
    expiresIn: process.env.JWT_EXPIRATION_TIME,
  });
};
