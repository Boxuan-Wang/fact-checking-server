import express from 'express';
import { Db, MongoClient } from "mongodb";
require("dotenv").config({ path: "./config.env" });
const uri:string = process.env.MONGO_URI?process.env.MONGO_URI:"";

let _Db: Db | undefined;

export default async function getDb():Promise<Db> {
    while(_Db === undefined) {
        await MongoClient
        .connect(uri)
        .then(client => _Db = client.db('fact-checking-website'))
        .catch(err => console.error(err));
    }
    return _Db;
};
