import argon2 from "argon2";
import { v4 as uuidv4 } from "uuid";
import prisma from "../prisma/db";
import { UserInput, LoginUserInput } from "../interfaces/user";
import { User } from "@prisma/client";
import { isCorrectPassword } from "../utils/checkPassword";

export const createUser = async (
  userData: UserInput
): Promise<Omit<User, "password">> => {
  const { firstName, lastName, email, password, phone } = userData;

  // Hash the password before storing it in the database
  const hashedPassword = await argon2.hash(password);

  const newUser = await prisma.user.create({
    data: {
      userId: uuidv4(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      organisations: {
        create: {
          orgId: uuidv4(),
          name: `${firstName}'s Organisation`,
          description: "",
        },
      },
    },
    select: {
      userId: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    },
  });
  return newUser;
};

export const loginUser = async (
  loginData: LoginUserInput
): Promise<Omit<User, "password">> => {
  const { email, password } = loginData;

  // Check if user exists and password is correct
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      userId: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      password: true,
    },
  });

  if (!user || !(await isCorrectPassword(user.password, password))) {
    throw new Error("Authentication failed");
  }
  // Exclude password from user object
  const { password: _, ...userWithoutPassword } = user;

  return userWithoutPassword;
};
