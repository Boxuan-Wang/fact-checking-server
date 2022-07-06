import dbRoutes from "../routes/dbRoutes";
import request from "supertest";
import connDb from "../connections/connDb";
var express = require('express');

var app = express();
app.use(require("../routes/dbRoutes"));

// test('test get /popular ', async () => {
//     const response = await request(app).get("/popular");
//     //todo: assert content TBD
// });