import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import { CustomRequest } from "../interfaces/customRequest";
import { NotFoundError } from "../exceptions/notFoundError";
import { UnauthorizedError } from "../exceptions/unauthorizedError";
import {
  findUserById,
  findUserInOrganisations,
} from "../services/user.service";

export const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    // Check if the user is accessing their own data or has permission to access
    const currentUser = (req as CustomRequest).user;
    if (currentUser?.userId !== id) {
      return next(
        new UnauthorizedError("You do not have permission to access this data")
      );
    }

    let user;
    if (currentUser?.userId === id) {
      user = await findUserById(id);
    } else {
      user = await findUserInOrganisations(currentUser.userId, id);
    }

    if (!user) {
      return next(new NotFoundError("user not found"));
    }

    return res.status(200).json({
      status: "success",
      message: "User fetched successfully",
      data: {
        user,
      },
    });
  }
);
