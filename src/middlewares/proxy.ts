import { NextFunction, Request, Response } from "express";
import { User } from "../../generated/prisma/client";
import { Role } from "../../generated/prisma/enums";
import { sendJSON } from "../helpers/send-json";
import { auth } from "../lib/auth";

export type resource =
  | "user"
  | "medicine"
  | "order"
  | "category"
  | "review"
  | "cart";
export type action = "create" | "read" | "update" | "delete";

export const proxy = (resource: resource, action: action) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await auth.api.getSession({
        headers: req.headers as Record<string, string>,
      });

      if (!session || !session.user) {
        return sendJSON(false, res, 401, "Unauthorized");
      }

      // attache user to req object
      req.user = session?.user as User;

      // check permission
      const hasPermission = await auth.api.userHasPermission({
        body: {
          userId: session?.user.id,
          role: session?.user.role as Role,
          permission: { [resource]: [action] },
        },
      });

      if (!hasPermission || !hasPermission.success) {
        return sendJSON(false, res, 403, "Forbidden");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
