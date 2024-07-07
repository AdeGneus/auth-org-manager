import { signToken, verifyToken } from "../src/utils/jwt";
import config from "config";

describe("JWT Utility Functions", () => {
  it("should generate a token with the correct details", () => {
    const payload = { userId: "123" };
    const token = signToken(payload, "accessTokenPrivateKey", {
      expiresIn: config.get<string>("accessTokenTtl"),
    });

    const decoded = verifyToken(token, "accessTokenPublicKey");
    expect(decoded).toHaveProperty("userId", "123");
  });

  it("should expire the token correctly", (done) => {
    const payload = { userId: "123" };
    const token = signToken(payload, "accessTokenPrivateKey", {
      expiresIn: "1s",
    });

    setTimeout(() => {
      expect(() => verifyToken(token, "accessTokenPublicKey")).toThrow();
      done();
    }, 1500);
  });
});
