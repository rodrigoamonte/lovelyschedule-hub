import jwt from "jsonwebtoken";
import { env } from "../../core/config/env.js";

const JWT_SECRET = env.JWT_SECRET!;

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
};

export const decodeToken = (token: string, isRefresh = false) => {
  const secret = isRefresh ? JWT_SECRET : JWT_SECRET;
  return jwt.verify(token, secret);
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
