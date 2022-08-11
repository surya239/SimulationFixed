import { createRequire } from "module";
const require = createRequire(import.meta.url);
import path from "path";
const express = require("express");
const app = express();
const jwt = require('jsonwebtoken')
const cors = require('cors');
import pool  from './db.js';
import axios from 'axios';
import bcrypt from 'bcrypt';
import {google} from 'googleapis'
app.use(cors());
const PORT = 5000
const __dirname = path.resolve();
app.use(express.static(path.join(__dirname,"client/build")))








app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
} )

app.listen(PORT, () =>{
    console.log("App Listening in ", PORT)
})