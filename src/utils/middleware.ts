import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { isUserForToken } from "./types";

export const tokenExtractor = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authorization = req.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer")) {
    req.token = authorization.substring(7);
  } else {
    req.token = null;
  }
  next();
};

export const userExtractor = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (!req.token) {
    req.user = null;
  } else {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      const user: unknown = jwt.verify(req.token, process.env.JWT_PRIVATE_KEY);
      if (isUserForToken(user)) {
        req.user = user;
      }
    } catch {
      req.user = null;
    }
  }
  next();
};
