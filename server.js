const express = require("express");
const app = express();
const cors = require("cors")

require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(require("./routes/dbRoutes"));
app.use(require("./routes/emailRoutes"))

// get driver connection
app.listen(port, () => {
    console.log("Start server! On port: " + port)
  })