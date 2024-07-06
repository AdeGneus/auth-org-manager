import { User as PrismaUser } from "@prisma/client";

export interface UserInput {
  firstName: PrismaUser["firstName"];
  lastName: PrismaUser["lastName"];
  email: PrismaUser["email"];
  password: PrismaUser["password"];
  phone?: PrismaUser["phone"];
}

export interface LoginUserInput {
  email: string;
  password: string;
}
