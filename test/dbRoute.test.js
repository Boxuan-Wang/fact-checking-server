const dbRoutes = require("../routes/dbRoutes");
var express = require('express');
var test = express();
test.use(dbRoutes);

test('test jest', () => {
    expect(1).toBe(1);
});
