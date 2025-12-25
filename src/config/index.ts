import "dotenv/config";

const config = {
  connection_str: process.env.POSTGRESQL,
  port: process.env.PORT,
};

export default config;
