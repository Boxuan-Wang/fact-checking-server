import express from "express";
import userRoutes from "./src/routes/userRoutes";
import emailRoutes from "./src/routes/emailRoutes";
import cors from "cors";
import bodyparser from "body-parser";
import { config } from "dotenv";
import { fetchNow, scheduleFetch } from "./src/connections/googleApi";
import checkRoute from "./src/routes/checkRoute";

const app = express();
config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(userRoutes);
app.use(emailRoutes);
app.use(checkRoute);

// get driver connection
app.listen(port, async () => {
    console.log("Start server! On port: " + port);
    const num = await fetchNow();
    console.log(`########\nFetched ${num} claims from google fact check api.\n########`);
    scheduleFetch();
  })

export default app;
  