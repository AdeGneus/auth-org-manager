import request from "supertest";
import app from "../src/app";
import prisma from "../src/prisma/db";

describe("Auth Endpoints - /auth/register", () => {
  beforeAll(async () => {
    // Clear database before running tests
    await prisma.user.deleteMany();
    await prisma.organisation.deleteMany();
  });

  afterAll(async () => {
    // Disconnect prisma after tests
    await prisma.$disconnect();
  });

  it("should register a user successfully with a default organisation", async () => {
    const response = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      phone: "1234567890",
    });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe("success");
    expect(response.body.message).toBe("Registration successful");

    const { user, accessToken } = response.body.data;

    expect(user.firstName).toBe("John");
    expect(user.lastName).toBe("Doe");
    expect(user.email).toBe("john.doe@example.com");
    expect(user.phone).toBe("1234567890");
    expect(accessToken).toBeDefined();

    const organisation = await prisma.organisation.findFirst({
      where: { name: "John's Organisation" },
    });
    expect(organisation).not.toBeNull();
  });

  it("should log the user in successfully", async () => {
    const registerResponse = await request(app).post("/auth/register").send({
      firstName: "Alice",
      lastName: "Brown",
      email: "alice.brown@example.com",
      password: "password123",
      phone: "0987654321",
    });

    const { accessToken } = registerResponse.body.data;

    const loginResponse = await request(app)
      .get("/api/organisations")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body.status).toBe("success");
    expect(loginResponse.body.message).toBe(
      "Organisations fetched successfully"
    );
  });

  it("should fail if required fields are missing", async () => {
    const response = await request(app).post("/auth/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "",
      password: "password123",
      phone: "1234567890",
    });

    expect(response.status).toBe(422);
    expect(response.body.errors).toContainEqual({
      field: "email",
      message: "Email is required",
    });
  });

  it("should fail if there's a duplicate email", async () => {
    // Register the first user
    await request(app).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.doe@example.com",
      password: "password123",
      phone: "0987654321",
    });

    // Attempt to register another user with the same email
    const response = await request(app).post("/auth/register").send({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.doe@example.com",
      password: "password123",
      phone: "0987654321",
    });

    expect(response.status).toBe(422);
    expect(response.body.errors).toContainEqual({
      field: "email",
      message: "Email already exists",
    });
  });
});
