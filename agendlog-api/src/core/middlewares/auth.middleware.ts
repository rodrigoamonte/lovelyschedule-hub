import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";
import { prisma } from "../database/prisma.js";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader)
    return res.status(401).json({ message: "Token not provided" });

  const [scheme, token] = authHeader.split(" ");
  if (scheme !== "Bearer" || !token)
    return res.status(401).json({ message: "Invalid format" });

  try {
    const decoded = verifyToken(token) as { sub: string; role: any };

    const user = await prisma.user.findFirst({
      where: {
        id: decoded.sub,
        status: "ACTIVE",
        deletedAt: null,
      },
    });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Inactive or removed user. Access denied." });
    }

    req.user = { id: user.id, role: user.role };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
