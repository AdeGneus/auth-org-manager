import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import { CustomRequest } from "../interfaces/customRequest";
import { NotFoundError } from "../exceptions/notFoundError";
import { UnauthorizedError } from "../exceptions/unauthorizedError";
import { findUserById } from "../services/user.service";
import { findOganisationsByUserId } from "../services/organisation.service";

export const getOrganisation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if the user is accessing their own data or has permission to access
    const currentUser = (req as CustomRequest).user;

    const organisations = await findOganisationsByUserId(currentUser?.userId);

    if (!organisations || organisations.length === 0) {
      return next(new NotFoundError("No organisations found for this user"));
    }

    return res.status(200).json({
      status: "success",
      message: "Organisations fetched successfully",
      data: {
        organisations,
      },
    });
  }
);
