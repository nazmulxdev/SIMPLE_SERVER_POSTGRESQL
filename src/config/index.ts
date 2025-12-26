import "dotenv/config";

const config = {
  connection_str: process.env.POSTGRESQL,
  port: process.env.PORT,
  jwt_secret: process.env.JWT_SECRET,
};

export default config;
