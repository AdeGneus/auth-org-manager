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
  orgId: string
) => {
  const organisations = await prisma.organisation.findMany({
    where: {
      users: {
        some: { userId },
      },
    },
    select: {
      users: {
        where: { userId },
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

  return organisations.map((org) => org.users[0]);
};
