import { NextFunction, Request, Response } from "express";
import { auth } from "../lib/auth";
import { Role } from "generated/prisma/enums";


declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name: string;
        role: Role;
        emailVerified: boolean;
      };
    }
  }
}

const authGuard = (...roles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        return res
          .status(401)
          .json({ message: "You are not authorized, please log in." });
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role: session.user.role as Role,
        emailVerified: session.user.emailVerified,
      };

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({
          message: "You do not have permission to access this resource.",
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authGuard;