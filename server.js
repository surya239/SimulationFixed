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
let L = ['100-0', '80-20', '70-30', '50-50', '30-70', '20-80'];
let x = [1800, 1900, 2000]
let y = [1200, 1300, 1400]
const teamRatio = ['1-5', '1-7', '1-10', '1-12']
const teamLeadSalary = [2500, 2600, 2700]
const projectDuration = 5
const teamLeadRatio = ['1-5', '1-7', '1-10', '1-12']
const pmSalary = [3500, 3600, 3700]
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

app.get('/adjust/:email', async(req, res) => {
    try {
        console.log(req.params)
        const result1 = await pool.query("SELECT * FROM adjust")
        const result2 = await pool.query("SELECT * from effort where useremail = $1",['abc@gmail.com'])
        const result = [result1.rows, result2.rows]
        res.json(result).status(200)
    } catch (error) {
        console.log(error)
    }
})

app.post("/changeeffort", async(req,res) => {
    try {
        const resp = req.body
        console.log(resp)
        const result = await pool.query("Update effort set effortpercentage = $1 where useremail = $2",[resp.value, 'abc@gmail.com'])
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
    }
})

app.post('/changeproductivity/:name', async(req, res) => {
    try {
        const {label} = req.body
        const {name} = req.params
        await pool.query(`UPDATE ${name} SET productivity = $1`, [label])
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
    }
})

app.get('/effortperunit/:produ', async(req, res) => {
    try {
        const {produ} = req.params
        const result1 = await pool.query(`SELECT ${produ} from complexscreen`)
        const result2 = await pool.query(`SELECT ${produ} from simplescreen`)
        const result3 = await pool.query(`Select ${produ} from complexdatabase`)
        const result4 = await pool.query(`Select ${produ} from simpledatabase`)
        const result5 = await pool.query(`Select ${produ} from complexapi`)
        const result6 = await pool.query(`Select ${produ} from simpleapi`)
        const result7 = await pool.query(`Select ${produ} from complexreport`)
        const result8 = await pool.query(`Select ${produ} from simplereport`)
        const result = [result1, result2, result3, result4, result5, result6, result7, result8]
        res.json(result).status(200)
    } catch (error) {
        console.log(error)
    }
})



app.get('/productivity/:name/:email', async(req, res) => {
    try {
        const {name, email} = req.params
        const p = await pool.query("SELECT * FROM productivity")
        const pr = await pool.query(`SELECT productivity from ${name}`)
        const unit = await pool.query(`SELECT ${pr.rows[0]['productivity']} from ${name}`)
        const wbs = await pool.query(`SELECT ${name} from wbs where useremail = $1`,[email])
        const {effortpercentage} = (await pool.query(`select effortpercentage from effort where useremail = $1`,['abc@gmail.com'])).rows[0]
        const effort = Math.round(wbs.rows[0][name] * unit.rows[0][pr.rows[0]['productivity']] / (effortpercentage /100))
        console.log(effort)
        res.json([p.rows, pr.rows[0]['productivity'], effort]).status(200)
    } catch (error) {
        console.log(error)
    }
})

app.get("/getresource/:email", async(req, res) => {
    try {
        const result = await pool.query("SELECT * FROM resourceValues")
        const lifeCycle = await pool.query("SELECT lifecycle from resource")
        const resource = await pool.query("SELECT * FROM resource")
        let Month = {
            resource:'',
            design:'',
            coding:'',
            testing:'',
            deployment:'',
            total:'',
        }
        
            if(lifeCycle.rows[0].lifecycle === '20,20,20,20,20'){
                Month = {
                    resource:20,
                    design:20,
                    coding:20,
                    testing:20,
                    deployment:20,
                    
                }
            }
            else if(lifeCycle.rows[0].lifecycle === '10,15,40,25,10'){
                Month = {
                    resource:10,
                    design:15,
                    coding:40,
                    testing:25,
                    deployment:15,
                
                }
            }
            else{
                Month = {
                    resource:5,
                    design:30,
                    coding:30,
                    testing:30,
                    deployment:5,
                }            
        }
        Month.total = Month.coding + Month.deployment + Month.design +Month.resource + Month.testing
        const query = await pool.query("UPDATE resource SET requirement = $1, design = $2, coding = $3, testing = $4, deployment = $5, total = $6",[Month.resource, Month.design, Month.coding, Month.testing, Month.deployment, Month.total])

        res.json([result.rows, Month, resource.rows]).status(200)
    } catch (error) {
        console.log(error)
    }
})

app.post('/changeresource', async(req, res) => {
    try {
        const {table, value} = req.body
        const result = await pool.query(`UPDATE resource SET ${table} = $1 `,[value])
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
    }
})

app.get("/resource/:complex/:simple/:set", async(req, res) => {
    try {
        const {complex, simple, set} = req.params
        const complexValue = await pool.query(`SELECT effortperunit from ${complex}`)
        const simpleValue = await pool.query(`SELECT effortperunit from ${simple}`)
        const cvalue = complexValue.rows[0].effortperunit
        const svalue = simpleValue.rows[0].effortperunit
        const result = await pool.query("SELECT * FROM resource")
        const value = (svalue + cvalue) / (result.rows[0].workingday * result.rows[0].phperday)
        const query = await pool.query(`SELECT requirement, design, coding, testing, deployment from resource`)
        const Resource = {
            requirement: value * (query.rows[0].requirement/ 100),
            design: value * (query.rows[0].design / 100),
            coding: value * (query.rows[0].coding / 100),
            testing: value * (query.rows[0].testing / 100),
            deployment: value * (query.rows[0].deployment / 100),
            total:0
        }
        Resource.total = Resource.coding + Resource.deployment + Resource.design + Resource.requirement + Resource.testing 
            const r = await pool.query(`UPDATE ${set} SET requirement = $1, design = $2, coding = $3, testing = $4, deployment = $5, total = $6`,[Resource.requirement,Resource.design, Resource.coding, Resource.testing, Resource.deployment, Resource.total])
            

        
        
        res.json([value, Resource]).status(200)
    } catch (error) {
        console.log(error)
    }
})

app.get('/milestoneresource/:name',async(req, res) => {
    try {
        const {name} = req.params
        const screen = await pool.query(`SELECT ${name} from screen `)
        const database = await pool.query(`SELECT ${name} from database `)
        const api= await pool.query(`SELECT ${name} from api `)
        const report = await pool.query(`SELECT ${name} from report`)
        const result = [screen.rows[0], database.rows[0], api.rows[0], report.rows[0]]
        let sum = 0;
        for(let i = 0; i<result.length; i++){
            sum += result[i][name]
        }
        await pool.query(`UPDATE mresource SET ${name} = $1`, [sum])
        res.json(sum).status(200)
    } catch (error) {
        console.log(error)
    }
})

app.get("/resourcecostvalues" , async(req, res) => {
    try {
        const result = await pool.query("SELECT * from resourcecost")

        res.json([L,x,y, result.rows]).status(200)
    } catch (error) {
        console.log(error)
    }
})

app.post("/changeresourcecost", async(req, res) => {
    try {
        const {coloumn, label} = req.body

        if(coloumn === 'pvst'){
            const value = label.split('-')
            console.log(value)
            const result = await pool.query("UPDATE resourcecost SET permenent = $1, temporaryload = $2",[value[0], value[1]])
        }
        else{
            await pool.query(`UPDATE resourcecost SET  ${coloumn} = $1 `, [label])
        }
        console.log(coloumn, label)
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
    }
})

app.get("/getresourcecost/:name/:load", async(req, res) => {
    try {
        const {name, load} = req.params
        console.log(name, load)
        const resource = await pool.query(`SELECT ${name} from mresource`)
        const loadValue = await pool.query(`SELECT ${load} from resourcecost`)
        const result = resource.rows[0][name] * (loadValue.rows[0][load] / 100)
        console.log(result)
        res.json(result).status(200)
    } catch (error) {
        console.log(error)
    }
})
app.get("/gettotalresource/:name", async(req, res) => {
    try {
        const {name} = req.params
        const resource = await pool.query("SELECT * from resourcecost")
        const value = await pool.query(`SELECT ${name} from mresource`)
        console.log(resource.rows)
        const result = Math.round(((value.rows[0][name] * (resource.rows[0]['permenent'] / 100) )* resource.rows[0]['permenentsalary']) + ((value.rows[0][name] * (resource.rows[0]['temporaryload'] / 100) * resource.rows[0]['temporarysalary'])))
        await pool.query(`UPDATE totalresource SET ${name} = $1`, [result])
        console.log(result)
        res.json(result).status(200)
    } catch (error) {
        console.log(error)
    }
})
app.get("/gettotalresourcecost", async(req, res) => {
    try {
        const resource = await pool.query("SELECT * FROM totalresource")
        const total = resource.rows[0]['requirement'] + resource.rows[0]['design'] +resource.rows[0]['coding'] + resource.rows[0]['deployment'] + resource.rows[0]['testing']
        res.json(total).status(200)
    } catch (error) {
        console.log(error)
    }
})

const Heuristic = [2,4,6,8,10,12,14,15]
const onshareOffshareRatio = ['1-5', '1-7', '1-10', '1-12']
const onSiteSalary = [4000, 4200, 4400]

app.get("/getproject", async(req, res) => {
    try {
        const result = await pool.query("SELECT * FROM projectmanagement")
        console.log(result.rows)
        const ratio = String(result.rows[0]['teamleader'])+'-'+String(result.rows[0]['teamemberratio'])
        // console.log(ratio)
        var noOfTeamMembers = 0
        if(ratio === '1-10'){
            noOfTeamMembers = 10
        }
        else if(ratio === '1-5'){
            noOfTeamMembers = 5
        }
        else if(ratio ==='1-7'){
            noOfTeamMembers=7
        }
        else if(ratio ==='1-12'){
            noOfTeamMembers = 12
        }
        else{
            noOfTeamMembers = 0
        }
        const teamratio = String(result.rows[0]['projectmanager'])+'-'+String(result.rows[0]['teamleadratio'])
        let noOfTeamLeadsCount = 0
        if(teamratio === '1-10'){
            noOfTeamLeadsCount = 10
        }
        else if(teamratio === '1-5'){
            noOfTeamLeadsCount = 5
        }
        else if(teamratio === '1-7'){
            noOfTeamLeadsCount=7
        }
        else if(teamratio === '1-12'){
            noOfTeamLeadsCount = 12
        }
        else{
            noOfTeamLeadsCount = 0
        }
        const resource = await pool.query(`SELECT * from mresource`)
        // console.log(resource.rows)
        const maxValue = Math.max(resource.rows[0]['requirement'], resource.rows[0]['design'], resource.rows[0]['coding'], resource.rows[0]['testing'], resource.rows[0]['deployment'])
        console.log(maxValue)
        const noOfTeamLeads = maxValue / noOfTeamMembers
        
        const costOfMonths = Math.round(projectDuration * noOfTeamLeads * result.rows[0]['teamleadsalary'])
        const noOfManager = noOfTeamLeads / noOfTeamLeadsCount
        const projectManagerCost = Math.round(projectDuration * noOfManager * result.rows[0]['pmsalary'])
        const totalresource = await pool.query("SELECT * FROM totalresource")
        const total = totalresource.rows[0]['requirement'] + totalresource.rows[0]['design'] + totalresource.rows[0]['coding'] + totalresource.rows[0]['deployment'] + totalresource.rows[0]['testing']
        res.json([
            teamRatio,
            ratio, 
            noOfTeamMembers, 
            noOfTeamLeads, 
            costOfMonths,
            teamLeadSalary, 
            result.rows[0]['teamleadsalary'], 
            noOfTeamLeadsCount, 
            teamLeadRatio,
            noOfManager,
            projectManagerCost,
            teamratio, 
            pmSalary,
            result.rows[0]['pmsalary'], 
            Heuristic,
            result.rows[0]['heuristic'],
            total * result.rows[0]['heuristic'] / 100,
            onshareOffshareRatio,
            String(result.rows[0]['onsite'])+'-'+String(result.rows[0]['offshore']),
            result.rows[0]['offshore'], 
            maxValue,
            onSiteSalary,
            result.rows[0]['onsitesalary'],
            result.rows[0]['onsitesalary']* projectDuration
        ]).status(200)
    } catch (error) {
        console.log(error)
    }
})

app.get('/getsubcontract/:name', async(req, res) => {
    try {
        const {name} = req.params
        const result = await pool.query(`SELECT sub1,sub2,sub3 from ${name}`)
        // const {sub1, sub2, sub3} = result.rows[0]
        // console.log(sub1, sub2, sub3)
        res.json([result.rows[0]]).status(200)
    } catch (error) {
        console.log(error)
    }
})

app.get('/getsubcontraccost/:name', async(req, res) => {
    try {
        const {name} = req.params
        const permenent = await pool.query("SELECT parmenentsalary from resourcecost")
        const mresource = await pool.query(`SELECT design from mresource`)
        const subContract = await pool.query(`SELECT sub1, sub2, sub3 from ${name}`)
        const result = [
        Math.round(permenent.rows[0]['parmenentsalary'] * mresource.rows[0]['design'] * (1+(subContract.rows[0]['sub1'] / 100))),
        Math.round(permenent.rows[0]['parmenentsalary'] * mresource.rows[0]['design'] * (1+(subContract.rows[0]['sub2'] / 100))),
        Math.round(permenent.rows[0]['parmenentsalary'] * mresource.rows[0]['design'] * (1+(subContract.rows[0]['sub3'] / 100)))
    ]
     res.json(result).status(200)   
    } catch (error) {
        console.log(error)
        res.sendStatus(500)
    }
})
const selectSubCon = ['none', 'subCon - 1', 'subCon - 2', 'subCon - 3']
app.get("/selectsubcon", async(req, res) => {
    try {
        const coding = await pool.query("SELECT subcontractor from coding")
        const design = await pool.query("SELECT subcontractor from design")
        const testing = await pool.query("SELECT subcontractor from testing")
        const deployment = await pool.query("SELECT subcontractor from deployment")
        
        res.json([
            selectSubCon,
            design.rows[0]['subcontractor'],
            coding.rows[0]['subcontractor'],
            testing.rows[0]['subcontractor'],
            deployment.rows[0]['subcontractor']
          ]).status(200)
    } catch (error) {
        console.log(error)
    }
})

app.get('/getriskrating/:name', async(req, res) => {
    try {
        const {name} = req.params
        const sub = await pool.query(`SELECT Subcontractor from ${name}`)
        // console.log(sub.rows[0]['subcontractor'])
        let risk = ''
        let cost = 0
        let resourcecost = 0
        let total = 0
        if(sub.rows[0]['subcontractor'] === 'None' || sub.rows[0]['subcontractor'] === 'none'){
            risk = 'None'
            cost = 0
            const Rcost = await pool.query(`SELECT ${name} from totalresource`)
            const mresource = await pool.query(`SELECT ${name} from mresource`)
            resourcecost = Rcost.rows[0][name]
            total = mresource.rows[0][name]
        }
        else{
            const Risk = await pool.query(`SELECT ${sub.rows[0]['subcontractor']} FROM riskrating`)
            risk = Risk.rows[0][sub.rows[0]['subcontractor']]
            const permenent = await pool.query("SELECT parmenentsalary from resourcecost")
        const mresource = await pool.query(`SELECT design from mresource`)
        const subContract = await pool.query(`SELECT ${sub.rows[0]['subcontractor']} from ${name}`)
        // console.log(subContract.rows[0][sub.rows[0]['subcontractor']] , mresource.rows[0][name])
        const result =  Math.round(permenent.rows[0]['parmenentsalary'] * mresource.rows[0]['design'] * (1+(subContract.rows[0][sub.rows[0]['subcontractor']] / 100)))
        cost = result
    
        }
        await pool.query(`UPDATE ${name} SET cost = $1, rcost = $2, total = $3`, [cost, resourcecost, total])
        
        res.json([
            risk, 
            cost,
            resourcecost,
            total
        ]).status(200)
    } catch (error) {
        console.log(error)
    }
})
const Infra = [500, 600, 700]
const costOfCapital = [7, 8, 9, 10,12,14,18,22]
app.get("/getinfra", async(req, res) => {
    try {
        const cost = await pool.query("SELECT cost from infra")
        res.json([Infra, cost.rows[0]['cost'], costOfCapital]).status(200)
    } catch (error) {
        console.log(error)
    }
})

app.get("/getcostofcapital", async(req, res) => {
    try {
        res.json([costOfCapital]).status(200)
    } catch (error) {
        console.log(error)
    }
})

const contigency = {
    Insignificant: 0.25,
    Minor: 0.5,
    Significant: 1,
    Major:2,
    Catastrophic:5,
    None:0
}

const contigencyPercentage = ['Insignificant', 'Minor','Significant' ,'Major', 'Catastrophic', 'None']

app.get('/contigency/:name', async(req, res) => {
    try {
        const {name} = req.params
        const value = await pool.query(`SELECT riskrating FROM ${name}`)
        res.json([contigencyPercentage, value.rows[0]['riskrating']]).status(200)
    } catch (error) {
        console.log(error)
    }
})

const overHead = [2,3,4]
const expectedProfit = [5, 10, 15, 20, 25,30,35]

app.get('/summary', async(req, res) => {
    try {
        res.json([overHead, expectedProfit]).status(200)
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