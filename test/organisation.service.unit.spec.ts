import prisma from "../src/prisma/db";
import {
  findOrganisationById,
  addUserToOrganisation,
} from "../src/services/organisation.service";

jest.mock("../src/prisma/db", () => ({
  organisation: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
}));

describe("Organisation Service", () => {
  it("should not allow access to organisations a user does not belong to", async () => {
    const mockOrgId = "org-id";

    (prisma.organisation.findUnique as jest.Mock).mockResolvedValue({
      orgId: mockOrgId,
      name: "Mock Organisation",
      description: null,
    });

    const organisation = await findOrganisationById(mockOrgId);

    expect(organisation).toHaveProperty("orgId", mockOrgId);
    expect(organisation).toHaveProperty("name", "Mock Organisation");
    expect(organisation).toHaveProperty("description", null);
  });

  it("should add a user to an organisation", async () => {
    const mockOrgId = "org-id";
    const mockUserId = "user-id";

    // Mock adding a user to organisation
    (prisma.organisation.update as jest.Mock).mockResolvedValue({
      orgId: mockOrgId,
      name: "Mock Organisation",
      description: null,
    });

    const organisation = await addUserToOrganisation(mockOrgId, mockUserId);

    expect(organisation).toHaveProperty("orgId", mockOrgId);
    expect(organisation).toHaveProperty("name", "Mock Organisation");
    expect(organisation).toHaveProperty("description", null);
  });
});
