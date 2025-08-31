import { Request, Response } from "express";
import { UserModel } from "../models/userModel.js";
import { hashPassword,verifyPassword } from "../lib/crypt.js";
import { signJwt } from "../lib/jwt.js";

export async function register(req: Request, res: Response) {
  try {
    const { email, password, name} = req.body as {
      email?: string; password?: string; name?: string; 
    };

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const exists = await UserModel.findOne({ email });
    if (exists) {
      return res.status(409).json({ error: "user already exist" });
    }

    const passwordHash = await hashPassword(password);

    const user = await UserModel.create({
      email, name, passwordHash
    });

    const token = signJwt({ id: user.id, email: user.email });
    return res.status(201).json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (error: unknown) {
    return res.status(500).json({ error: "internal conflict" });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "invalid user" });
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "invalid password" });
    }

    const token = signJwt({ id: user.id, email: user.email });
    return res.json({
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (error: unknown) {
    return res.status(500).json({ error: "internal conflict" });
  }
}
