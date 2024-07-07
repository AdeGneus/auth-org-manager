module.exports = {
  port: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV,

  accessTokenTtl: process.env.ACCESS_TOKEN_TTL,
  accessTokenPrivateKey: process.env.ACCESS_TOKEN_PRIVATE_KEY,
  accessTokenPublicKey: process.env.ACCESS_TOKEN_PUBLIC_KEY,
};
