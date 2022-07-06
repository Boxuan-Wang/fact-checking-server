import express, { json } from "express";
import dbRoutes from "./src/routes/dbRoutes";
import emailRoutes from "./src/routes/emailRoutes";
import cors from "cors";
import { config } from "dotenv";

const app = express();
config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(json());
app.use(dbRoutes);
app.use(emailRoutes);

// get driver connection
app.listen(port, () => {
    console.log("Start server! On port: " + port)
  })