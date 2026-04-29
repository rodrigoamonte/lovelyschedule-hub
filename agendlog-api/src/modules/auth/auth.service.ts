import bcrypt from "bcrypt";
import { prisma } from "../../core/database/prisma.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
} from "../../core/utils/jwt.js";

export class AuthService {
  async validateUser(email: string, pass: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) return user;
    return null;
  }

  createSession(userId: string, role: string) {
    const payload = { sub: userId, role };
    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
    };
  }

  async refreshSession(token: string) {
    const decoded = verifyToken(token) as {
      sub: string;
      role: string;
      exp: number;
    };

    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user || user.status !== "ACTIVE") {
      throw new Error("Invalid or inactive user");
    }

    const accessToken = generateAccessToken({ sub: user.id, role: user.role });

    const nowInSeconds = Math.floor(Date.now() / 1000);
    const shouldRenewRefresh = decoded.exp - nowInSeconds < 86400;

    return {
      accessToken,
      refreshToken: shouldRenewRefresh
        ? generateRefreshToken({ sub: user.id, role: user.role })
        : token,
    };
  }
}
