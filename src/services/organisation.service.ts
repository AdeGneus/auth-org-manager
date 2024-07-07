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

export const isUserInOrganisation = async (userId: string, orgId: string) => {
  const organisation = await prisma.organisation.findFirst({
    where: {
      orgId,
      users: {
        some: { userId },
      },
    },
  });
  return organisation !== null;
};

export const findOrganisationById = async (orgId: string) => {
  const organisation = await prisma.organisation.findUnique({
    where: { orgId },
    select: {
      orgId: true,
      name: true,
      description: true,
    },
  });
  return organisation;
};
