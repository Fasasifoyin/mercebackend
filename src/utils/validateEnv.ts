import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";

export default cleanEnv(process.env, {
  NODE_ENV: str(),
  MONGO_URL: str(),
  PORT: port(),
  SESSION_KEY: str(),
  COOKIE_NAME: str(),
  USER: str(),
  CLIENT_ID: str(),
  CLIENT_SECRET: str(),
  REFRESH_TOKEN: str(),
  ACCESS_TOKEN: str(),
  CLOUDINARY_CLOUD_NAME: str(),
  CLOUDINARY_API_KEY: str(),
  CLOUDINARY_API_SECRET: str(),
});
