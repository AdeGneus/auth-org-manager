import { SignOptions, sign, verify } from "jsonwebtoken";
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

export const verifyToken = <U>(
  token: string,
  keyName: "accessTokenPublicKey"
): U => {
  const publicKey = Buffer.from(config.get<string>(keyName), "base64").toString(
    "ascii"
  );

  const decoded = verify(token, publicKey) as U;

  return decoded;
};
