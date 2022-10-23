import { createRequire } from "module";
const require = createRequire(import.meta.url);
import path from "path";
const express = require("express");
const app = express();
const jwt = require('jsonwebtoken')
import routes from "./ServerRoute/index.js";
const cors = require('cors');
import pool  from './db.js';
import axios from 'axios';
import bcrypt from 'bcrypt';
import {google} from 'googleapis'
app.use(cors());

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname,"client/build")))



app.use(express.json())

const PORT = process.env.PORT || 5000;

routes.forEach(route => {
    app[route.method](route.path, route.handler);
});


app.get("*", (req, res) => {
    res.sendStatus(200)
} )

app.listen(PORT, () =>{
    console.log("App Listening in ", PORT)
})