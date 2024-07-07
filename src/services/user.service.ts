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

export const findUserInOrganisations = async (
  userId: string,
  orgUserId: string
) => {
  const organisations = await prisma.organisation.findMany({
    where: {
      users: {
        some: { userId },
      },
    },
    select: {
      users: {
        where: { userId: orgUserId },
        select: {
          userId: true,
          firstName: true,
          lastName: true,
          email: true,
          phone: true,
        },
      },
    },
  });

  return organisations.flatMap((org) => org.users);
};
