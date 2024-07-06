import { NextFunction, Request, Response } from "express";
import asyncHandler from "./asyncHandler";
import { UnauthorizedError } from "../exceptions/unauthorizedError";
import { verifyToken } from "../utils/jwt";
import prisma from "../prisma/db";
import { CustomRequest } from "../interfaces/customRequest";

const deserializeUser = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    // 1) Get token and check if it exists
    let accessToken = "";

    if (req.headers.authorization && req.headers.authorization.startsWith("")) {
      accessToken = req.headers.authorization.split(" ")[1];
    }

    if (!accessToken) {
      return next(
        new UnauthorizedError(
          "You are not logged in! Please log in to get access"
        )
      );
    }

    // 2) Verify token
    const decoded = verifyToken<{ userId: string }>(
      accessToken,
      "accessTokenPublicKey"
    );
    const userId = decoded?.userId;

    // 3) Check if user still exists
    if (decoded) {
      const currentUser = await prisma.user.findUnique({
        where: { userId },
      });

      if (!currentUser) {
        return next(
          new UnauthorizedError(
            "The user belonging to this token does no longer exist"
          )
        );
      }
      // Grant access to protected route
      (req as CustomRequest).user = currentUser;
      return next();
    }

    return next();
  }
);

export default deserializeUser;
