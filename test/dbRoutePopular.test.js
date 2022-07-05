const dbRoutes = require("../routes/dbRoutes");
const supertest = require("supertest");
const connDb = require("../connections/connDb");
var express = require('express');
const { request } = require("express");

var app = express();
app.use(dbRoutes);

test('test get /popular ', async () => {
    const response = await request(app).get("/popular");
    //todo: assert content TBD
});