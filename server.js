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

const __dirname = path.resolve();
app.use(express.static(path.join(__dirname,"client/build")))



app.use(express.json())

const PORT = process.env.PORT || 5000;

app.post('/wbs', async(req,res) => {
    try {
        const {coloumn, value} = req.body;
        console.log(coloumn, typeof(value))
        let Cvalue = parseInt(value)
        await pool.query(`UPDATE WBS SET ${coloumn} = $1 WHERE userEmail = $2`,[ Cvalue, 'abc@gmail.com'])
        const result = await pool.query(`SELECT * FROM WBS where userEmail =$1 `,['abc@gmail.com'])
        const {complexscreen, simplescreen, complexdatabase, simpledatabase, complexapi, simpleapi, complexreport, simplereport} = result.rows[0]
        const total = complexscreen + simplescreen + complexdatabase + simpledatabase + complexapi + simpleapi + complexreport + simplereport
        await pool.query('UPDATE WBS SET total = $1 WHERE userEmail = $2', [total,'abc@gmail.com'])
        res.json(total).status(200)
    } catch (error) {
        console.error(error)
    }
})

app.post('/wbsdefault', async(req, res) => {
    try {
        const result = await pool.query("SELECT * from WBS WHERE userEmail= $1",['default'])
        const {complexscreen, simplescreen, complexdatabase, simpledatabase, complexapi, simpleapi, complexreport, simplereport, total} = result.rows[0]
        await pool.query("Update WBS SET complexscreen = $1, simplescreen = $2, complexdatabase = $3, simpledatabase = $4,complexapi= $5,  simpleapi = $6,complexreport = $7, simplereport= $8, total = $9 WHERE useremail = $10",
        [complexscreen, simplescreen, complexdatabase, simpledatabase, complexapi, simpleapi,complexreport, simplereport, total, 'abc@gmail.com'])
        res.json(result.rows[0]).status(200)
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})

app.get('/tablevalues/:table/:userEmail', async(req,res) => {
    try {
        const {table, userEmail} = req.params
        const result = pool.query(`SELECT * FROM ${table} WHERE useremail = $1`,[userEmail])
        res.json((await result).rows[0]).status(200)
    } catch (error) {
        console.log(error)
    }
})

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
} )

app.listen(PORT, () =>{
    console.log("App Listening in ", PORT)
})