import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export interface UserPayload {
  id: string;
  iat: number; // issued at
  exp: number; // expiration date
}

// Pridedame naują savybę prie Express.Request
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  // Patikriname, ar „Authorization“ antraštė yra tinkamai pateikta
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    // Gauti JWT tokeną
    const token = authHeader.split(" ")[1];

    // Patikrinkite ir iškoduokite JWT tokeną
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as UserPayload;

    // Priskirkite iškoduotą duomenį į `req.currentUser`
    req.currentUser = payload;
  } catch (err) {
    // Jei JWT yra netinkamas arba nepavyksta patikrinti
    return res.status(401).json({ error: "Not authenticated" });
  }

  // Jei viskas gerai, perduokime kontrolę kitam middleware
  next();
};

export default authMiddleware;
