import type { Request, Response } from "express";
import { UserService } from "./user.service.js";
import { Role } from "@prisma/client";

const userService = new UserService();

export const getUsers = async (req: Request, res: Response) => {
  const users = await userService.findAll();
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await userService.create(req.body);
    const { password, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error: any) {
    if (error.code === "P2002")
      return res.status(400).json({ message: "Email already registered" });
    res.status(500).json({ message: "Error creating user" });
  }
};

export const updateUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    const user = await userService.update(req.params.id, req.body);
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: "Error updating user" });
  }
};

export const deleteUser = async (
  req: Request<{ id: string }>,
  res: Response,
) => {
  try {
    await userService.delete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ message: "User not found" });
  }
};

export const getRoles = async (req: Request, res: Response) => {
  return res.json(Object.values(Role));
};
