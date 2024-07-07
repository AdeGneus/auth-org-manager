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

export const createNewOrganisation = async (
  name: string,
  description: string | null,
  userId: string
) => {
  const newOrganisation = await prisma.organisation.create({
    data: {
      name,
      description,
      users: {
        connect: { userId },
      },
    },
    select: {
      orgId: true,
      name: true,
      description: true,
    },
  });

  return newOrganisation;
};

export const addUserToOrganisation = async (orgId: string, userId: string) => {
  const organisation = await prisma.organisation.update({
    where: { orgId },
    data: {
      users: {
        connect: { userId },
      },
    },
  });
  return organisation;
};
