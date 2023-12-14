import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import createHttpError, { isHttpError } from "http-errors";
import generalRoute from "./routes/general";
import userRoute from "./routes/user";
import companyRoute from "./routes/company";
import userVendorRoute from "./routes/userVendor";
import session from "express-session";
import ENV from "./utils/validateEnv";
import MongoStore from "connect-mongo";

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173", "https://mercebackend.onrender.com"],
    credentials: true,
  })
);

app.use(
  session({
    name: ENV.COOKIE_NAME,
    secret: ENV.SESSION_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 30000 * 10 * 10,
      sameSite: "lax",
    },
    rolling: true,
    store: MongoStore.create({
      mongoUrl: ENV.MONGO_URL,
    }),
  })
);
// app.set("trust proxy", 1);

app.use("/api/general", generalRoute);
app.use("/api/users", userRoute);
app.use("/api/company", companyRoute);
app.use("/api/uservendor", userVendorRoute);

app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.log(error);
  let errorMessage = "An unknown error occurred";
  let statusCode = 500;

  if (isHttpError(error)) {
    errorMessage = error.message;
    statusCode = error.status;
  }

  res.status(statusCode).json({ error: errorMessage });
});

export default app;
