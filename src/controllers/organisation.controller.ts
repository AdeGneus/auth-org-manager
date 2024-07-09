import { NextFunction, Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import { CustomRequest } from "../interfaces/customRequest";
import { NotFoundError } from "../exceptions/notFoundError";
import {
  addUserToOrganisation,
  createNewOrganisation,
  findOganisationsByUserId,
  findOrganisationById,
  isUserInOrganisation,
} from "../services/organisation.service";
import { UnauthorizedError } from "../exceptions/unauthorizedError";
import { ClientError } from "../exceptions/clientError";

export const getOrganisations = asyncHandler(
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

export const getOrganisation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orgId } = req.params;
    const currentUser = (req as CustomRequest).user;

    // Check if user belongs to the organization
    const hasAccess = await isUserInOrganisation(currentUser?.userId, orgId);

    if (!hasAccess) {
      return next(new UnauthorizedError("Authentication failed"));
    }

    const organisation = await findOrganisationById(orgId);

    if (!organisation) {
      return next(new NotFoundError("organisation not found"));
    }

    return res.status(200).json({
      status: "success",
      message: "Organization fetched successfully",
      data: {
        organisation,
      },
    });
  }
);

export const createOrganisation = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;
    const currentUser = (req as CustomRequest).user;

    const newOrganisation = await createNewOrganisation(
      name,
      description,
      currentUser?.userId
    );

    if (!newOrganisation) {
      return new ClientError("Client Error");
    }

    return res.status(201).json({
      status: "success",
      message: "Organisation created successfully",
      data: newOrganisation,
    });
  }
);

export const addUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { orgId } = req.params;
    const { userId } = req.body;
    const currentUser = (req as CustomRequest).user;

    if (!userId) {
      return next(new ClientError("Invalid request"));
    }

    // Check if current user belongs to the organization
    const hasAccess = await isUserInOrganisation(currentUser?.userId, orgId);

    if (!hasAccess) {
      return next(new UnauthorizedError("Authentication failed"));
    }

    await addUserToOrganisation(orgId, userId);

    return res.status(200).json({
      status: "success",
      message: "User added to organisation successfully",
    });
  }
);
