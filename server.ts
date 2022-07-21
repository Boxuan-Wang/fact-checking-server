import express from "express";
import dbRoutes from "./src/routes/dbRoutes";
import emailRoutes from "./src/routes/emailRoutes";
import cors from "cors";
import bodyparser from "body-parser";
import { config } from "dotenv";
import { fetchNow, scheduleFetch } from "./src/connections/googleApi";

const app = express();
config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));
app.use(dbRoutes);
app.use(emailRoutes);

// get driver connection
app.listen(port, async () => {
    console.log("Start server! On port: " + port);
    const num = await fetchNow();
    console.log(`Fetched ${num} claims from google fact check api.`);
    scheduleFetch();
  })

export default app;
  