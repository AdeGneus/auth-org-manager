import { SignOptions, sign } from "jsonwebtoken";
import config from "config";

export const signToken = (
  object: Object,
  keyName: "accessTokenPrivateKey",
  options?: SignOptions | undefined
) => {
  const signingKey = Buffer.from(
    config.get<string>(keyName),
    "base64"
  ).toString("ascii");

  return sign(object, signingKey, {
    ...(options && options),
    algorithm: "RS256",
  });
};
