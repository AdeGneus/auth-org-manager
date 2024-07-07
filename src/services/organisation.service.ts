import prisma from "../prisma/db";

export const findOganisationsByUserId = async (userId: string) => {
  const organisations = await prisma.organisation.findMany({
    where: {
      users: {
        some: { userId },
      },
    },
    select: {
      orgId: true,
      name: true,
      description: true,
    },
  });

  return organisations;
};
