import prisma from "../prisma/db";

export const findUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { userId: id },
    select: {
      userId: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
    },
  });

  return user;
};
