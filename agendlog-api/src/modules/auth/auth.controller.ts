import type { Request, Response } from "express";
import { AuthService } from "./auth.service.js";

const authService = new AuthService();

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await authService.validateUser(email, password);

    if (!user)
      return res.status(401).json({ message: "Invalid credentials" });

    const tokens = authService.createSession(user.id, user.role);

    return res.json({
      user: { id: user.id, name: user.name, role: user.role },
      ...tokens,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(400).json({ message: "Token is required" });

    const tokens = await authService.refreshSession(refreshToken);
    return res.json(tokens);
  } catch (error) {
    return res
      .status(401)
      .json({ message: "Session expired. Please log in again." });
  }
};
