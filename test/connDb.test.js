const conn = require("../connections/connDb");
const express = require('express');
require('supertest');

test('connect to db from local', async () => {
    const res = await conn.getDb();
    expect(res!==undefined&&res!==null).toBe(true);
});