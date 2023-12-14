import app from "./app";
import ENV from "./utils/validateEnv";
import mongoose, { ConnectOptions } from "mongoose";

mongoose
  .connect(ENV.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => app.listen(ENV.PORT, () => console.log("App connected")))
  .catch((error) => console.log(error));
