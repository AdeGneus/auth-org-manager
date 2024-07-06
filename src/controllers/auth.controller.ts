import { NextFunction, Request, Response } from "express";
import config from "config";
import asyncHandler from "../middlewares/asyncHandler";
import prisma from "../prisma/db";
import { ConflictError } from "../exceptions/conflictError";
import { signToken } from "../utils/jwt";
import { createUser, loginUser } from "../services/auth.service";
import { ClientError } from "../exceptions/clientError";

const createSendToken = (
  user: Object,
  statusCode: number,
  message: string,
  res: Response
) => {
  // Create an access token
  const accessToken = signToken(user, "accessTokenPrivateKey", {
    expiresIn: config.get<string>("accessTokenTtl"),
  });

  res.status(statusCode).json({
    status: "success",
    message,
    data: {
      accessToken,
      user,
    },
  });
};

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, password, phone } = req.body;

    // Check if user already exist
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return next(new ConflictError("User already exists"));
    }

    // Create a new user record
    const newUser = await createUser({
      firstName,
      lastName,
      email,
      password,
      phone,
    });
    createSendToken(newUser, 201, "Registration successful", res);
  }
);

export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // Check if email and password exists
    if (!email || !password) {
      return next(new ClientError("Please provide email and password!"));
    }

    const user = await loginUser({ email, password });
    createSendToken(user, 200, "Login successful", res);
  }
);
