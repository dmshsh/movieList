import { Request, Response, NextFunction } from "express";
import { verifyJwt,JwtPayload } from "../lib/jwt.js";


declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: "no auth header" });
  }

  const [schema, token] = authHeader.split(" ");
  if (schema !== "Bearer" || !token) {
    return res.status(401).json({ error: "expected:bearer 'token'" });
  }

  try {
    const payload = verifyJwt(token);       
    req.user = payload;                    
    return next();
  } catch (error: unknown) {
    return res.status(403).json({ error: "invalid token" });
  }
}

