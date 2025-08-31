import jwt from "jsonwebtoken";
import { Secret, SignOptions } from "jsonwebtoken";

const EXPIRES_IN = process.env.TOKEN_EXPIRES ?? "7d"; 

export type JwtPayload = { 
    id: string; 
    email: string; 
};

const SECRET: Secret = process.env.TOKEN_SECRET || "supersecretkey";

export function signJwt(payload: object): string {
  const options: SignOptions = { expiresIn: EXPIRES_IN as SignOptions["expiresIn"] };
  return jwt.sign(payload, SECRET, options);
}

export function verifyJwt(token: string): JwtPayload {
  return jwt.verify(token, SECRET) as JwtPayload;
}
