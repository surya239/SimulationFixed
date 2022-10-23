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
import { query } from "express";
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
        const permenent = await pool.query("SELECT permenentsalary from resourcecost")
        const mresource = await pool.query(`SELECT design from mresource`)
        const subContract = await pool.query(`SELECT sub1, sub2, sub3 from ${name}`)
        const result = [
        Math.round(permenent.rows[0]['permenentsalary'] * mresource.rows[0]['design'] * (1+(subContract.rows[0]['sub1'] / 100))),
        Math.round(permenent.rows[0]['permenentsalary'] * mresource.rows[0]['design'] * (1+(subContract.rows[0]['sub2'] / 100))),
        Math.round(permenent.rows[0]['permenentsalary'] * mresource.rows[0]['design'] * (1+(subContract.rows[0]['sub3'] / 100)))
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
        console.log('hi')
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

app.post('/changesub', async(req, res) => {
    try {
        const {value, c1} = req.body
        let val = ''
        if(value === 'none'){
            val = 'none'
        }
        else if(value === 'subCon - 1'){
            val = 'sub1'
        }
        else if(value === 'subCon - 2'){
            val = 'sub2'
        }
        else if(value === 'subCon - 3'){
            val = 'sub3'
        }
        console.log(val)
        const result = await pool.query(`UPDATE ${c1} SET subcontractor = $1`, [val])
        res.sendStatus(200)
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
        console.log(sub.rows)
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
            const permenent = await pool.query("SELECT permenentsalary from resourcecost")
        const mresource = await pool.query(`SELECT design from mresource`)
        const subContract = await pool.query(`SELECT ${sub.rows[0]['subcontractor']} from ${name}`)
        // console.log(subContract.rows[0][sub.rows[0]['subcontractor']] , mresource.rows[0][name])
        const result =  Math.round(permenent.rows[0]['permenentsalary'] * mresource.rows[0]['design'] * (1+(subContract.rows[0][sub.rows[0]['subcontractor']] / 100)))
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
        const wbs = await pool.query(`SELECT * from wbs where useremail = $1`,['abc@gmail.com'])
        const accuracy = await pool.query(`SELECT * from effort where useremail = $1`,['abc@gmail.com'])
        const cost1 = await pool.query("SELECT cost from infra")
        const pcs = await pool.query(`Select productivity from complexscreen`)
        const pss = await pool.query(`Select productivity from simplescreen`)
        const pcd = await pool.query(`select productivity from complexdatabase`)
        const psd = await pool.query(`Select productivity from simpledatabase`)
        const pca = await pool.query(`select productivity from complexapi`)
        const psa = await pool.query(`select productivity from simpleapi`)
        const pcr = await pool.query(`select productivity from complexreport`)
        const psr = await pool.query(`select productivity from simplereport`)
        const ucs = await pool.query(`select ${pcs.rows[0]['productivity']} from complexscreen`)
        const uss = await pool.query(`select ${pss.rows[0]['productivity']} from simplescreen`)
        const ucd = await pool.query(`select ${pcd.rows[0]['productivity']} from complexdatabase`)
        const usd = await pool.query(`select ${psd.rows[0]['productivity']} from simpledatabase`)
        const uca = await pool.query(`select ${pca.rows[0]['productivity']} from complexapi`)
        const usa = await pool.query(`select ${psa.rows[0]['productivity']} from simpleapi`)
        const ucr = await pool.query(`select ${pcr.rows[0]['productivity']} from complexreport`)
        const usr = await pool.query(`select ${psr.rows[0]['productivity']} from simplereport`)
        const estimation = accuracy.rows[0]['effortpercentage'] / 100
        const Screen = (ucs.rows[0][pcs.rows[0]['productivity']] * wbs.rows[0]['complexscreen'] ) / (estimation) + (uss.rows[0][pss.rows[0]['productivity']] * wbs.rows[0]['simplescreen'] ) / (estimation)
        const Database = (ucd.rows[0][pcd.rows[0]['productivity']] * wbs.rows[0]['complexdatabase'] ) / (estimation) + (usd.rows[0][psd.rows[0]['productivity']] * wbs.rows[0]['simpledatabase'] ) / (estimation)
        const Api = (uca.rows[0][pca.rows[0]['productivity']] * wbs.rows[0]['complexapi'] ) / (estimation) + (usa.rows[0][psa.rows[0]['productivity']] * wbs.rows[0]['simpleapi'] ) / (estimation)
        const Report = (ucr.rows[0][pcr.rows[0]['productivity']] * wbs.rows[0]['complexreport'] ) / (estimation) + (usr.rows[0][psr.rows[0]['productivity']] * wbs.rows[0]['simplereport'] ) / (estimation)
        const resource = await pool.query(`SELECT * from resource`)
        const Module1 = Screen / (resource.rows[0]['workingday'] * resource.rows[0]['phperday'])
        const Module2 = Database / (resource.rows[0]['workingday'] * resource.rows[0]['phperday'])
        const Module3 = Api / (resource.rows[0]['workingday'] * resource.rows[0]['phperday'])
        const Module4 = Report / (resource.rows[0]['workingday'] * resource.rows[0]['phperday'])
        const requirement = Module1 * (resource.rows[0]['requirement'] / 100) + Module2 * (resource.rows[0]['requirement'] / 100) + Module3 * (resource.rows[0]['requirement'] / 100) + Module4 * (resource.rows[0]['requirement'] / 100)
        const Design = Module1 * (resource.rows[0]['design'] / 100) + Module2 * (resource.rows[0]['design'] / 100) + Module3 * (resource.rows[0]['design'] / 100) + Module4 * (resource.rows[0]['design'] / 100)
        const coding = Module1 * (resource.rows[0]['coding'] / 100) + Module2 * (resource.rows[0]['coding'] / 100) + Module3 * (resource.rows[0]['coding'] / 100) + Module4 * (resource.rows[0]['coding'] / 100)
        const testing = Module1 * (resource.rows[0]['testing'] / 100) + Module2 * (resource.rows[0]['testing'] / 100) + Module3 * (resource.rows[0]['testing'] / 100) + Module4 * (resource.rows[0]['testing'] / 100)
        const deployment = Module1 * (resource.rows[0]['deployment'] / 100) + Module2 * (resource.rows[0]['deployment'] / 100) + Module3 * (resource.rows[0]['deployment'] / 100) + Module4 * (resource.rows[0]['deployment'] / 100)
        const r = await pool.query("SELECT * FROM requirement")
        const d = await pool.query("SELECT * FROM design")
        const c = await pool.query("SELECT * FROM coding")
        const t = await pool.query("SELECT * from testing")
        const de = await pool.query("SELECT * FROM deployment")
        const project = (await pool.query(`SELECT * from projectmanagement`)).rows[0]
       
        const salary = await pool.query("SELECT * from resourcecost")
        const maxValue = Math.max(requirement, Design, coding, testing, deployment)
        const onsite = Math.round(5 * maxValue/project.offshore * project.onsitesalary)
        const totalProject = Math.round((maxValue/project.teamemberratio * 5 * project.teamleadsalary) + ( maxValue/project.teamemberratio/ project.teamleadratio * 5 * project.pmsalary))

        
        const p =salary.rows[0]['permenentsalary']
        console.log(p)
        const temp = salary.rows[0]['temporarysalary']
        const permenent = {
            requirement: Math.round((requirement * salary.rows[0]['permenent'] / 100) * p +  (requirement * salary.rows[0]['temporaryload'] / 100) * temp),
            design: Math.round(Design * salary.rows[0]['permenent'] / 100 * p+ (Design * salary.rows[0]['temporaryload'] / 100) * temp),
            coding: Math.round(coding * salary.rows[0]['permenent'] / 100 * p + (coding * salary.rows[0]['temporaryload'] / 100) * temp),
            testing: Math.round(testing * salary.rows[0]['permenent'] / 100 * p + (testing * salary.rows[0]['temporaryload'] / 100) * temp),
            deployment: Math.round(deployment * salary.rows[0]['permenent'] /100 * p + (deployment * salary.rows[0]['temporaryload'] / 100) * temp)
        }
        const sub1 = {
            design: Math.round(p * Design* (1 +(d.rows[0]['sub1']/100))),
            coding: Math.round(p * Design*  (1 +(c.rows[0]['sub1']/100))),
            testing: Math.round(p * Design*  (1 +(t.rows[0]['sub1']/100))),
            deployment: Math.round(p * Design* (1 +(de.rows[0]['sub1']/100))),
        }
        const sub2 = {
            design: Math.round(p * Design* (1 +(d.rows[0]['sub2']/100))),
            coding: Math.round(p * Design*  (1 +(c.rows[0]['sub2']/100))),
            testing: Math.round(p * Design*  (1 +(t.rows[0]['sub2']/100))),
            deployment: Math.round(p * Design* (1 +(de.rows[0]['sub2']/100))),
        }
        const sub3 = {
            design: Math.round(p * Design* (1 +(d.rows[0]['sub3']/100))),
            coding: Math.round(p * Design*  (1 +(c.rows[0]['sub3']/100))),
            testing: Math.round(p * Design*  (1 +(t.rows[0]['sub3']/100))),
            deployment: Math.round(p * Design* (1 +(de.rows[0]['sub3']/100))),
        }
        const subcost = {
            requirement: 0,
            design: d.rows[0]['subcontractor'] === 'none' ? 0: d.rows[0]['subcontractor'] === 'sub1' ? sub1.design : d.rows[0]['subcontractor'] === 'sub2'?sub2.design : sub3.design,
            coding: c.rows[0]['subcontractor'] === 'none' ? 0: c.rows[0]['subcontractor'] === 'sub1' ? sub1.coding : c.rows[0]['subcontractor'] === 'sub2'?sub2.coding : sub3.coding,
            testing: t.rows[0]['subcontractor'] === 'none' ? 0: t.rows[0]['subcontractor'] === 'sub1' ? sub1.testing : d.rows[0]['subcontractor'] === 'sub2'?sub2.testing : sub3.testing,
            deployment: de.rows[0]['subcontractor'] === 'none' ? 0: de.rows[0]['subcontractor'] === 'sub1' ? sub1.deployment : de.rows[0]['subcontractor'] === 'sub2'?sub2.deployment : sub3.deployment
        }
        const rcost = {
            requirement: subcost.requirement === 0? permenent.requirement : 0,
            design: subcost.design === 0 ? permenent.design : 0,
            coding: subcost.coding === 0 ? permenent.coding : 0,
            testing: subcost.testing === 0 ? permenent.testing : 0,
            deployment: subcost.deployment === 0 ? permenent.deployment : 0
        }
        const noOftotalcost = {
            requirement: subcost.requirement === 0 ? requirement * salary.rows[0]['permenent'] / 100 + requirement * salary.rows[0]['temporaryload'] / 100 : 0,
            design: subcost.design === 0 ? Design * salary.rows[0]['permenent'] / 100 + Design * salary.rows[0]['temporaryload'] / 100 : 0,
            coding: subcost.coding === 0 ? coding * salary.rows[0]['permenent'] / 100 + coding * salary.rows[0]['temporaryload'] / 100 : 0,
            testing: subcost.testing === 0 ? testing * salary.rows[0]['permenent'] / 100 + testing * salary.rows[0]['temporaryload'] / 100 : 0,
            deployment: subcost.deployment === 0 ? deployment * salary.rows[0]['permenent'] / 100 + deployment * salary.rows[0]['temporaryload'] / 100 : 0,
        }
        const inhouse = {
            requirement: contigencyCost[r.rows[0]['riskrating']],
            design:contigencyCost[d.rows[0]['riskrating']],
            coding:contigencyCost[c.rows[0]['riskrating']],
            testing:contigencyCost[t.rows[0]['riskrating']],
            deployment:contigencyCost[de.rows[0]['riskrating']]
        }
        const riskValue = await (await pool.query('SELECT * from riskrating')).rows[0]
        const subRisk = {
            requirement: contigencyCost[r.rows[0]['subcontractor']],
            design:contigencyCost[riskValue[d.rows[0]['subcontractor']]],
            coding:contigencyCost[riskValue[c.rows[0]['subcontractor']]],
            testing:contigencyCost[riskValue[t.rows[0]['subcontractor']]],
            deployment:contigencyCost[riskValue[de.rows[0]['subcontractor']]]
        }
     
        const contigency = {
            requirement:rcost.requirement * inhouse.requirement / 100 + subcost.requirement * subRisk.requirement /100,
            design: rcost.design * inhouse.design / 100 + subcost.design * subRisk.design/100,
            coding:rcost.coding * inhouse.coding / 100 + subcost.coding * subRisk.coding /100,
            testing: rcost.testing * inhouse.testing / 100 + subcost.testing * subRisk.testing /100,
            deployment: rcost.deployment * inhouse.deployment / 100 + subcost.deployment * subRisk.deployment /100
        }
        console.log(rcost, subcost, subRisk, inhouse)
        const totalNoOfCOST = noOftotalcost.requirement + noOftotalcost.design + noOftotalcost.coding + noOftotalcost.testing + noOftotalcost.deployment
       
         
        const {cost} = (await pool.query(`SELECT cost from infra`)).rows[0]
        const infra = Math.round(totalNoOfCOST * cost)
res.json([Infra, cost1.rows[0]['cost'], costOfCapital, infra]).status(200)
    } catch (error) {
        console.log(error)
    }
})

app.get("/getcostofcapital", async(req, res) => {
    try {
        const {costofcapital} = await (await pool.query(`SELECT * from finance`)).rows[0]
        console.log(costofcapital)
        const wbs = await pool.query(`SELECT * from wbs where useremail = $1`,['abc@gmail.com'])
        const accuracy = await pool.query(`SELECT * from effort where useremail = $1`,['abc@gmail.com'])
        const pcs = await pool.query(`Select productivity from complexscreen`)
        const pss = await pool.query(`Select productivity from simplescreen`)
        const pcd = await pool.query(`select productivity from complexdatabase`)
        const psd = await pool.query(`Select productivity from simpledatabase`)
        const pca = await pool.query(`select productivity from complexapi`)
        const psa = await pool.query(`select productivity from simpleapi`)
        const pcr = await pool.query(`select productivity from complexreport`)
        const psr = await pool.query(`select productivity from simplereport`)
        const ucs = await pool.query(`select ${pcs.rows[0]['productivity']} from complexscreen`)
        const uss = await pool.query(`select ${pss.rows[0]['productivity']} from simplescreen`)
        const ucd = await pool.query(`select ${pcd.rows[0]['productivity']} from complexdatabase`)
        const usd = await pool.query(`select ${psd.rows[0]['productivity']} from simpledatabase`)
        const uca = await pool.query(`select ${pca.rows[0]['productivity']} from complexapi`)
        const usa = await pool.query(`select ${psa.rows[0]['productivity']} from simpleapi`)
        const ucr = await pool.query(`select ${pcr.rows[0]['productivity']} from complexreport`)
        const usr = await pool.query(`select ${psr.rows[0]['productivity']} from simplereport`)
        const estimation = accuracy.rows[0]['effortpercentage'] / 100
        const Screen = (ucs.rows[0][pcs.rows[0]['productivity']] * wbs.rows[0]['complexscreen'] ) / (estimation) + (uss.rows[0][pss.rows[0]['productivity']] * wbs.rows[0]['simplescreen'] ) / (estimation)
        const Database = (ucd.rows[0][pcd.rows[0]['productivity']] * wbs.rows[0]['complexdatabase'] ) / (estimation) + (usd.rows[0][psd.rows[0]['productivity']] * wbs.rows[0]['simpledatabase'] ) / (estimation)
        const Api = (uca.rows[0][pca.rows[0]['productivity']] * wbs.rows[0]['complexapi'] ) / (estimation) + (usa.rows[0][psa.rows[0]['productivity']] * wbs.rows[0]['simpleapi'] ) / (estimation)
        const Report = (ucr.rows[0][pcr.rows[0]['productivity']] * wbs.rows[0]['complexreport'] ) / (estimation) + (usr.rows[0][psr.rows[0]['productivity']] * wbs.rows[0]['simplereport'] ) / (estimation)
        const resource = await pool.query(`SELECT * from resource`)
        const Module1 = Screen / (resource.rows[0]['workingday'] * resource.rows[0]['phperday'])
        const Module2 = Database / (resource.rows[0]['workingday'] * resource.rows[0]['phperday'])
        const Module3 = Api / (resource.rows[0]['workingday'] * resource.rows[0]['phperday'])
        const Module4 = Report / (resource.rows[0]['workingday'] * resource.rows[0]['phperday'])
        const requirement = Module1 * (resource.rows[0]['requirement'] / 100) + Module2 * (resource.rows[0]['requirement'] / 100) + Module3 * (resource.rows[0]['requirement'] / 100) + Module4 * (resource.rows[0]['requirement'] / 100)
        const Design = Module1 * (resource.rows[0]['design'] / 100) + Module2 * (resource.rows[0]['design'] / 100) + Module3 * (resource.rows[0]['design'] / 100) + Module4 * (resource.rows[0]['design'] / 100)
        const coding = Module1 * (resource.rows[0]['coding'] / 100) + Module2 * (resource.rows[0]['coding'] / 100) + Module3 * (resource.rows[0]['coding'] / 100) + Module4 * (resource.rows[0]['coding'] / 100)
        const testing = Module1 * (resource.rows[0]['testing'] / 100) + Module2 * (resource.rows[0]['testing'] / 100) + Module3 * (resource.rows[0]['testing'] / 100) + Module4 * (resource.rows[0]['testing'] / 100)
        const deployment = Module1 * (resource.rows[0]['deployment'] / 100) + Module2 * (resource.rows[0]['deployment'] / 100) + Module3 * (resource.rows[0]['deployment'] / 100) + Module4 * (resource.rows[0]['deployment'] / 100)
        const r = await pool.query("SELECT * FROM requirement")
        const d = await pool.query("SELECT * FROM design")
        const c = await pool.query("SELECT * FROM coding")
        const t = await pool.query("SELECT * from testing")
        const de = await pool.query("SELECT * FROM deployment")
        const project = (await pool.query(`SELECT * from projectmanagement`)).rows[0]
       
        const salary = await pool.query("SELECT * from resourcecost")
        const maxValue = Math.max(requirement, Design, coding, testing, deployment)
        const onsite = Math.round(5 * maxValue/project.offshore * project.onsitesalary)
        const totalProject = Math.round((maxValue/project.teamemberratio * 5 * project.teamleadsalary) + ( maxValue/project.teamemberratio/ project.teamleadratio * 5 * project.pmsalary))

        
        const p =salary.rows[0]['permenentsalary']
        console.log(p)
        const temp = salary.rows[0]['temporarysalary']
        const permenent = {
            requirement: Math.round((requirement * salary.rows[0]['permenent'] / 100) * p +  (requirement * salary.rows[0]['temporaryload'] / 100) * temp),
            design: Math.round(Design * salary.rows[0]['permenent'] / 100 * p+ (Design * salary.rows[0]['temporaryload'] / 100) * temp),
            coding: Math.round(coding * salary.rows[0]['permenent'] / 100 * p + (coding * salary.rows[0]['temporaryload'] / 100) * temp),
            testing: Math.round(testing * salary.rows[0]['permenent'] / 100 * p + (testing * salary.rows[0]['temporaryload'] / 100) * temp),
            deployment: Math.round(deployment * salary.rows[0]['permenent'] /100 * p + (deployment * salary.rows[0]['temporaryload'] / 100) * temp)
        }
        const sub1 = {
            design: Math.round(p * Design* (1 +(d.rows[0]['sub1']/100))),
            coding: Math.round(p * Design*  (1 +(c.rows[0]['sub1']/100))),
            testing: Math.round(p * Design*  (1 +(t.rows[0]['sub1']/100))),
            deployment: Math.round(p * Design* (1 +(de.rows[0]['sub1']/100))),
        }
        const sub2 = {
            design: Math.round(p * Design* (1 +(d.rows[0]['sub2']/100))),
            coding: Math.round(p * Design*  (1 +(c.rows[0]['sub2']/100))),
            testing: Math.round(p * Design*  (1 +(t.rows[0]['sub2']/100))),
            deployment: Math.round(p * Design* (1 +(de.rows[0]['sub2']/100))),
        }
        const sub3 = {
            design: Math.round(p * Design* (1 +(d.rows[0]['sub3']/100))),
            coding: Math.round(p * Design*  (1 +(c.rows[0]['sub3']/100))),
            testing: Math.round(p * Design*  (1 +(t.rows[0]['sub3']/100))),
            deployment: Math.round(p * Design* (1 +(de.rows[0]['sub3']/100))),
        }
        const subcost = {
            requirement: 0,
            design: d.rows[0]['subcontractor'] === 'none' ? 0: d.rows[0]['subcontractor'] === 'sub1' ? sub1.design : d.rows[0]['subcontractor'] === 'sub2'?sub2.design : sub3.design,
            coding: c.rows[0]['subcontractor'] === 'none' ? 0: c.rows[0]['subcontractor'] === 'sub1' ? sub1.coding : c.rows[0]['subcontractor'] === 'sub2'?sub2.coding : sub3.coding,
            testing: t.rows[0]['subcontractor'] === 'none' ? 0: t.rows[0]['subcontractor'] === 'sub1' ? sub1.testing : d.rows[0]['subcontractor'] === 'sub2'?sub2.testing : sub3.testing,
            deployment: de.rows[0]['subcontractor'] === 'none' ? 0: de.rows[0]['subcontractor'] === 'sub1' ? sub1.deployment : de.rows[0]['subcontractor'] === 'sub2'?sub2.deployment : sub3.deployment
        }
        const rcost = {
            requirement: subcost.requirement === 0? permenent.requirement : 0,
            design: subcost.design === 0 ? permenent.design : 0,
            coding: subcost.coding === 0 ? permenent.coding : 0,
            testing: subcost.testing === 0 ? permenent.testing : 0,
            deployment: subcost.deployment === 0 ? permenent.deployment : 0
        }
        const noOftotalcost = {
            requirement: subcost.requirement === 0 ? requirement * salary.rows[0]['permenent'] / 100 + requirement * salary.rows[0]['temporaryload'] / 100 : 0,
            design: subcost.design === 0 ? Design * salary.rows[0]['permenent'] / 100 + Design * salary.rows[0]['temporaryload'] / 100 : 0,
            coding: subcost.coding === 0 ? coding * salary.rows[0]['permenent'] / 100 + coding * salary.rows[0]['temporaryload'] / 100 : 0,
            testing: subcost.testing === 0 ? testing * salary.rows[0]['permenent'] / 100 + testing * salary.rows[0]['temporaryload'] / 100 : 0,
            deployment: subcost.deployment === 0 ? deployment * salary.rows[0]['permenent'] / 100 + deployment * salary.rows[0]['temporaryload'] / 100 : 0,
        }
        const inhouse = {
            requirement: contigencyCost[r.rows[0]['riskrating']],
            design:contigencyCost[d.rows[0]['riskrating']],
            coding:contigencyCost[c.rows[0]['riskrating']],
            testing:contigencyCost[t.rows[0]['riskrating']],
            deployment:contigencyCost[de.rows[0]['riskrating']]
        }
        const riskValue = await (await pool.query('SELECT * from riskrating')).rows[0]
        const subRisk = {
            requirement: contigencyCost[r.rows[0]['subcontractor']],
            design:contigencyCost[riskValue[d.rows[0]['subcontractor']]],
            coding:contigencyCost[riskValue[c.rows[0]['subcontractor']]],
            testing:contigencyCost[riskValue[t.rows[0]['subcontractor']]],
            deployment:contigencyCost[riskValue[de.rows[0]['subcontractor']]]
        }
     
        const contigency = {
            requirement:rcost.requirement * inhouse.requirement / 100 + subcost.requirement * subRisk.requirement /100,
            design: rcost.design * inhouse.design / 100 + subcost.design * subRisk.design/100,
            coding:rcost.coding * inhouse.coding / 100 + subcost.coding * subRisk.coding /100,
            testing: rcost.testing * inhouse.testing / 100 + subcost.testing * subRisk.testing /100,
            deployment: rcost.deployment * inhouse.deployment / 100 + subcost.deployment * subRisk.deployment /100
        }
        console.log(rcost, subcost, subRisk, inhouse)
        const {overhead, expectedprofit} = (await pool.query('SELECT * from bidsummary')).rows[0]
        
        const totalCotigency = Math.round(contigency.requirement + contigency.design + contigency.coding + contigency.testing + contigency.deployment)

        const totalSubContractRisk = rcost.requirement + rcost.design + rcost.coding + rcost.testing + rcost.deployment
        const totalSubCost = subcost.requirement + subcost.design + subcost.coding +  subcost.testing + subcost.deployment
        const totalNoOfCOST = noOftotalcost.requirement + noOftotalcost.design + noOftotalcost.coding + noOftotalcost.testing + noOftotalcost.deployment
       
         
        const {cost} = (await pool.query(`SELECT cost from infra`)).rows[0]
        const infra = Math.round(totalNoOfCOST * cost)
    //    console.log(totalSubCost , totalSubContractRisk ,infra , totalCotigency , onsite ,totalProject)
        const overHeadCost = (totalSubCost + totalSubContractRisk + infra + totalCotigency + onsite + totalProject) * overhead / 100
        const profit = ((totalSubCost + totalSubContractRisk + infra + totalCotigency + onsite + totalProject+overHeadCost + 11121 ) / (1 - expectedprofit /100)) - (totalSubCost + totalSubContractRisk + infra + totalCotigency + onsite + totalProject+overHeadCost + 11121)
        const bitPrice = overHeadCost + totalSubCost + totalSubContractRisk + infra + totalCotigency + onsite + totalProject +profit + 11121
        const cashOut = {
            requirement: rcost.requirement + subcost.requirement + (totalProject/5),
            design: rcost.design + subcost.design + (totalProject/5),
            coding: rcost.coding + subcost.coding + (totalProject/5),
            testing: rcost.testing+ subcost.testing + (totalProject/5),
            deployment: rcost.deployment + subcost.deployment + (totalProject/5)
        }
        const cashIn = {
            requirement: bitPrice * (5/100),
            design: bitPrice * (10/100),
            coding: bitPrice * (20/100),
            testing: bitPrice * (5/100),
            deployment: bitPrice * (60/100)
        }
        const workingCapital = {
            requirement: cashOut.requirement-cashIn.requirement,
            design: cashOut.design - cashIn.design,
            coding: cashOut.coding -cashIn.coding,
            testing: cashOut.testing-cashIn.testing,
            deployment: cashOut.deployment - cashIn.deployment
        }
        let workingCapitalcum = {
            requirement: workingCapital.requirement,
            design:0,
            coding:0,
            testing: 0,
            deployment: 0
        }
        workingCapitalcum.design = workingCapital.design + workingCapitalcum.requirement
        workingCapitalcum.coding = workingCapital.coding + workingCapitalcum.design
        workingCapitalcum.testing = workingCapital.coding + workingCapital.testing
        workingCapitalcum.deployment = workingCapital.deployment + workingCapitalcum.testing
        console.log(workingCapitalcum.requirement * costofcapital / 100)
        const finance = {
            requirement: workingCapitalcum.requirement > 0 ? workingCapitalcum.requirement * costofcapital /100 : 0 ,
            design: workingCapitalcum.design > 0 ? workingCapitalcum.design * costofcapital /100 : 0 ,
            coding: workingCapitalcum.coding > 0 ? workingCapitalcum.coding * costofcapital /100 : 0 ,
            testing: workingCapitalcum.testing > 0 ? workingCapitalcum.testing * costofcapital /100 : 0 ,
            deployment: workingCapitalcum.deployment > 0 ? workingCapitalcum.deployment * costofcapital /100 : 0};
            const totalFinance = finance.requirement + finance.design + finance.coding + finance.deployment + finance.testing
        res.json([costofcapital, costOfCapital, Math.round(totalFinance)]).status(200)
    } catch (error) {
        console.log(error)
    }
})

app.post('/changecostofcapital', async(req, res) => {
    try {
        const {value} = req.body
        await pool.query(`UPDATE finance SET costofcapital = $1`,[value])
        res.sendStatus(200)
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
        const sub = await pool.query(`SELECT Subcontractor, cost, rcost from ${name}`)
        const inhouse = contigency[value.rows[0]['riskrating']]
        var risk = ''
        if(sub.rows[0]['subcontractor'] === 'None' || sub.rows[0]['subcontractor'] === 'none'){
            risk = 'None'
        }
        else{
            const Risk = await pool.query(`SELECT ${sub.rows[0]['subcontractor']} FROM riskrating`)
            risk = Risk.rows[0][sub.rows[0]['subcontractor']]
        }
        const subRisk = contigency[risk]
        const c = Math.round((sub.rows[0]['rcost'] * inhouse / 100) + (sub.rows[0]['cost'] * subRisk /100))
        await pool.query(`UPDATE ${name} SET contigency = $1`,[c])
        res.json([contigencyPercentage, value.rows[0]['riskrating'], inhouse, risk, subRisk, c]).status(200)
    } catch (error) {
        console.log(error)
    }
})

const overHead = [2,3,4]
const expectedProfit = [5, 10, 15, 20, 25,30,35]

app.get('/summary', async(req, res) => {
    try {
        const wbs = await pool.query(`SELECT * from wbs where useremail = $1`,['abc@gmail.com'])
        const accuracy = await pool.query(`SELECT * from effort where useremail = $1`,['abc@gmail.com'])
        const pcs = await pool.query(`Select productivity from complexscreen`)
        const pss = await pool.query(`Select productivity from simplescreen`)
        const pcd = await pool.query(`select productivity from complexdatabase`)
        const psd = await pool.query(`Select productivity from simpledatabase`)
        const pca = await pool.query(`select productivity from complexapi`)
        const psa = await pool.query(`select productivity from simpleapi`)
        const pcr = await pool.query(`select productivity from complexreport`)
        const psr = await pool.query(`select productivity from simplereport`)
        const ucs = await pool.query(`select ${pcs.rows[0]['productivity']} from complexscreen`)
        const uss = await pool.query(`select ${pss.rows[0]['productivity']} from simplescreen`)
        const ucd = await pool.query(`select ${pcd.rows[0]['productivity']} from complexdatabase`)
        const usd = await pool.query(`select ${psd.rows[0]['productivity']} from simpledatabase`)
        const uca = await pool.query(`select ${pca.rows[0]['productivity']} from complexapi`)
        const usa = await pool.query(`select ${psa.rows[0]['productivity']} from simpleapi`)
        const ucr = await pool.query(`select ${pcr.rows[0]['productivity']} from complexreport`)
        const usr = await pool.query(`select ${psr.rows[0]['productivity']} from simplereport`)
        const estimation = accuracy.rows[0]['effortpercentage'] / 100
        const Screen = (ucs.rows[0][pcs.rows[0]['productivity']] * wbs.rows[0]['complexscreen'] ) / (estimation) + (uss.rows[0][pss.rows[0]['productivity']] * wbs.rows[0]['simplescreen'] ) / (estimation)
        const Database = (ucd.rows[0][pcd.rows[0]['productivity']] * wbs.rows[0]['complexdatabase'] ) / (estimation) + (usd.rows[0][psd.rows[0]['productivity']] * wbs.rows[0]['simpledatabase'] ) / (estimation)
        const Api = (uca.rows[0][pca.rows[0]['productivity']] * wbs.rows[0]['complexapi'] ) / (estimation) + (usa.rows[0][psa.rows[0]['productivity']] * wbs.rows[0]['simpleapi'] ) / (estimation)
        const Report = (ucr.rows[0][pcr.rows[0]['productivity']] * wbs.rows[0]['complexreport'] ) / (estimation) + (usr.rows[0][psr.rows[0]['productivity']] * wbs.rows[0]['simplereport'] ) / (estimation)
        const resource = await pool.query(`SELECT * from resource`)
        const Module1 = Screen / (resource.rows[0]['workingday'] * resource.rows[0]['phperday'])
        const Module2 = Database / (resource.rows[0]['workingday'] * resource.rows[0]['phperday'])
        const Module3 = Api / (resource.rows[0]['workingday'] * resource.rows[0]['phperday'])
        const Module4 = Report / (resource.rows[0]['workingday'] * resource.rows[0]['phperday'])
        const requirement = Module1 * (resource.rows[0]['requirement'] / 100) + Module2 * (resource.rows[0]['requirement'] / 100) + Module3 * (resource.rows[0]['requirement'] / 100) + Module4 * (resource.rows[0]['requirement'] / 100)
        const Design = Module1 * (resource.rows[0]['design'] / 100) + Module2 * (resource.rows[0]['design'] / 100) + Module3 * (resource.rows[0]['design'] / 100) + Module4 * (resource.rows[0]['design'] / 100)
        const coding = Module1 * (resource.rows[0]['coding'] / 100) + Module2 * (resource.rows[0]['coding'] / 100) + Module3 * (resource.rows[0]['coding'] / 100) + Module4 * (resource.rows[0]['coding'] / 100)
        const testing = Module1 * (resource.rows[0]['testing'] / 100) + Module2 * (resource.rows[0]['testing'] / 100) + Module3 * (resource.rows[0]['testing'] / 100) + Module4 * (resource.rows[0]['testing'] / 100)
        const deployment = Module1 * (resource.rows[0]['deployment'] / 100) + Module2 * (resource.rows[0]['deployment'] / 100) + Module3 * (resource.rows[0]['deployment'] / 100) + Module4 * (resource.rows[0]['deployment'] / 100)
        const r = await pool.query("SELECT * FROM requirement")
        const d = await pool.query("SELECT * FROM design")
        const c = await pool.query("SELECT * FROM coding")
        const t = await pool.query("SELECT * from testing")
        const de = await pool.query("SELECT * FROM deployment")
        const project = (await pool.query(`SELECT * from projectmanagement`)).rows[0]
       
        const salary = await pool.query("SELECT * from resourcecost")
        const maxValue = Math.max(requirement, Design, coding, testing, deployment)
        const onsite = Math.round(5 * maxValue/project.offshore * project.onsitesalary)
        const totalProject = Math.round((maxValue/project.teamemberratio * 5 * project.teamleadsalary) + ( maxValue/project.teamemberratio/ project.teamleadratio * 5 * project.pmsalary))

        
        const p =salary.rows[0]['permenentsalary']
        console.log(p)
        const temp = salary.rows[0]['temporarysalary']
        const permenent = {
            requirement: Math.round((requirement * salary.rows[0]['permenent'] / 100) * p +  (requirement * salary.rows[0]['temporaryload'] / 100) * temp),
            design: Math.round(Design * salary.rows[0]['permenent'] / 100 * p+ (Design * salary.rows[0]['temporaryload'] / 100) * temp),
            coding: Math.round(coding * salary.rows[0]['permenent'] / 100 * p + (coding * salary.rows[0]['temporaryload'] / 100) * temp),
            testing: Math.round(testing * salary.rows[0]['permenent'] / 100 * p + (testing * salary.rows[0]['temporaryload'] / 100) * temp),
            deployment: Math.round(deployment * salary.rows[0]['permenent'] /100 * p + (deployment * salary.rows[0]['temporaryload'] / 100) * temp)
        }
        const sub1 = {
            design: Math.round(p * Design* (1 +(d.rows[0]['sub1']/100))),
            coding: Math.round(p * Design*  (1 +(c.rows[0]['sub1']/100))),
            testing: Math.round(p * Design*  (1 +(t.rows[0]['sub1']/100))),
            deployment: Math.round(p * Design* (1 +(de.rows[0]['sub1']/100))),
        }
        const sub2 = {
            design: Math.round(p * Design* (1 +(d.rows[0]['sub2']/100))),
            coding: Math.round(p * Design*  (1 +(c.rows[0]['sub2']/100))),
            testing: Math.round(p * Design*  (1 +(t.rows[0]['sub2']/100))),
            deployment: Math.round(p * Design* (1 +(de.rows[0]['sub2']/100))),
        }
        const sub3 = {
            design: Math.round(p * Design* (1 +(d.rows[0]['sub3']/100))),
            coding: Math.round(p * Design*  (1 +(c.rows[0]['sub3']/100))),
            testing: Math.round(p * Design*  (1 +(t.rows[0]['sub3']/100))),
            deployment: Math.round(p * Design* (1 +(de.rows[0]['sub3']/100))),
        }
        const subcost = {
            requirement: 0,
            design: d.rows[0]['subcontractor'] === 'none' ? 0: d.rows[0]['subcontractor'] === 'sub1' ? sub1.design : d.rows[0]['subcontractor'] === 'sub2'?sub2.design : sub3.design,
            coding: c.rows[0]['subcontractor'] === 'none' ? 0: c.rows[0]['subcontractor'] === 'sub1' ? sub1.coding : c.rows[0]['subcontractor'] === 'sub2'?sub2.coding : sub3.coding,
            testing: t.rows[0]['subcontractor'] === 'none' ? 0: t.rows[0]['subcontractor'] === 'sub1' ? sub1.testing : d.rows[0]['subcontractor'] === 'sub2'?sub2.testing : sub3.testing,
            deployment: de.rows[0]['subcontractor'] === 'none' ? 0: de.rows[0]['subcontractor'] === 'sub1' ? sub1.deployment : de.rows[0]['subcontractor'] === 'sub2'?sub2.deployment : sub3.deployment
        }
        const rcost = {
            requirement: subcost.requirement === 0? permenent.requirement : 0,
            design: subcost.design === 0 ? permenent.design : 0,
            coding: subcost.coding === 0 ? permenent.coding : 0,
            testing: subcost.testing === 0 ? permenent.testing : 0,
            deployment: subcost.deployment === 0 ? permenent.deployment : 0
        }
        const noOftotalcost = {
            requirement: subcost.requirement === 0 ? requirement * salary.rows[0]['permenent'] / 100 + requirement * salary.rows[0]['temporaryload'] / 100 : 0,
            design: subcost.design === 0 ? Design * salary.rows[0]['permenent'] / 100 + Design * salary.rows[0]['temporaryload'] / 100 : 0,
            coding: subcost.coding === 0 ? coding * salary.rows[0]['permenent'] / 100 + coding * salary.rows[0]['temporaryload'] / 100 : 0,
            testing: subcost.testing === 0 ? testing * salary.rows[0]['permenent'] / 100 + testing * salary.rows[0]['temporaryload'] / 100 : 0,
            deployment: subcost.deployment === 0 ? deployment * salary.rows[0]['permenent'] / 100 + deployment * salary.rows[0]['temporaryload'] / 100 : 0,
        }
        const inhouse = {
            requirement: contigencyCost[r.rows[0]['riskrating']],
            design:contigencyCost[d.rows[0]['riskrating']],
            coding:contigencyCost[c.rows[0]['riskrating']],
            testing:contigencyCost[t.rows[0]['riskrating']],
            deployment:contigencyCost[de.rows[0]['riskrating']]
        }
        const riskValue = await (await pool.query('SELECT * from riskrating')).rows[0]
        const subRisk = {
            requirement: contigencyCost[r.rows[0]['subcontractor']],
            design:contigencyCost[riskValue[d.rows[0]['subcontractor']]],
            coding:contigencyCost[riskValue[c.rows[0]['subcontractor']]],
            testing:contigencyCost[riskValue[t.rows[0]['subcontractor']]],
            deployment:contigencyCost[riskValue[de.rows[0]['subcontractor']]]
        }
     
        const contigency = {
            requirement:rcost.requirement * inhouse.requirement / 100 + subcost.requirement * subRisk.requirement /100,
            design: rcost.design * inhouse.design / 100 + subcost.design * subRisk.design/100,
            coding:rcost.coding * inhouse.coding / 100 + subcost.coding * subRisk.coding /100,
            testing: rcost.testing * inhouse.testing / 100 + subcost.testing * subRisk.testing /100,
            deployment: rcost.deployment * inhouse.deployment / 100 + subcost.deployment * subRisk.deployment /100
        }
        console.log(rcost, subcost, subRisk, inhouse)
        const {overhead, expectedprofit} = (await pool.query('SELECT * from bidsummary')).rows[0]
        
        const totalCotigency = Math.round(contigency.requirement + contigency.design + contigency.coding + contigency.testing + contigency.deployment)

        const totalSubContractRisk = rcost.requirement + rcost.design + rcost.coding + rcost.testing + rcost.deployment
        const totalSubCost = subcost.requirement + subcost.design + subcost.coding +  subcost.testing + subcost.deployment
        const totalNoOfCOST = noOftotalcost.requirement + noOftotalcost.design + noOftotalcost.coding + noOftotalcost.testing + noOftotalcost.deployment
       
         
        const {cost} = (await pool.query(`SELECT cost from infra`)).rows[0]
        const infra = Math.round(totalNoOfCOST * cost)
    //    console.log(totalSubCost , totalSubContractRisk ,infra , totalCotigency , onsite ,totalProject)
        const overHeadCost = (totalSubCost + totalSubContractRisk + infra + totalCotigency + onsite + totalProject) * overhead / 100
        const profit = ((totalSubCost + totalSubContractRisk + infra + totalCotigency + onsite + totalProject+overHeadCost + 11121 ) / (1 - expectedprofit /100)) - (totalSubCost + totalSubContractRisk + infra + totalCotigency + onsite + totalProject+overHeadCost + 11121)
        const bitPrice = overHeadCost + totalSubCost + totalSubContractRisk + infra + totalCotigency + onsite + totalProject +profit + 11121
        res.json([overHead, expectedProfit, overhead, expectedprofit, totalSubContractRisk, totalSubCost, infra,onsite, totalCotigency, totalProject,overHeadCost,11121, profit, bitPrice]).status(200)
    } catch (error) {
        console.log(error)
    }
})
const contigencyCost = {
    Insignificant:0.25,
    Minor:0.5,
    Significant:1,
    Major:2,
    Catastrophic:5,
    None:0,
    none:0
}

app.post('/changecontigency', async(req, res) => {
    try {
        const {name, label} = req.body
        const result = await pool.query(`UPDATE ${name} SET riskrating = $1`,[label])
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
    }
})
app.get('/getbid/:email', async(req, res) => {
    try {
        const {email} = req.params
        const wbs = await pool.query(`SELECT * from wbs where useremail = $1`,[email])
        const accuracy = await pool.query(`SELECT * from effort where useremail = $1`,[email])
        const pcs = await pool.query(`Select productivity from complexscreen`)
        const pss = await pool.query(`Select productivity from simplescreen`)
        const pcd = await pool.query(`select productivity from complexdatabase`)
        const psd = await pool.query(`Select productivity from simpledatabase`)
        const pca = await pool.query(`select productivity from complexapi`)
        const psa = await pool.query(`select productivity from simpleapi`)
        const pcr = await pool.query(`select productivity from complexreport`)
        const psr = await pool.query(`select productivity from simplereport`)
        const ucs = await pool.query(`select ${pcs.rows[0]['productivity']} from complexscreen`)
        const uss = await pool.query(`select ${pss.rows[0]['productivity']} from simplescreen`)
        const ucd = await pool.query(`select ${pcd.rows[0]['productivity']} from complexdatabase`)
        const usd = await pool.query(`select ${psd.rows[0]['productivity']} from simpledatabase`)
        const uca = await pool.query(`select ${pca.rows[0]['productivity']} from complexapi`)
        const usa = await pool.query(`select ${psa.rows[0]['productivity']} from simpleapi`)
        const ucr = await pool.query(`select ${pcr.rows[0]['productivity']} from complexreport`)
        const usr = await pool.query(`select ${psr.rows[0]['productivity']} from simplereport`)
        const estimation = accuracy.rows[0]['effortpercentage'] / 100
        const Screen = (ucs.rows[0][pcs.rows[0]['productivity']] * wbs.rows[0]['complexscreen'] ) / (estimation) + (uss.rows[0][pss.rows[0]['productivity']] * wbs.rows[0]['simplescreen'] ) / (estimation)
        const Database = (ucd.rows[0][pcd.rows[0]['productivity']] * wbs.rows[0]['complexdatabase'] ) / (estimation) + (usd.rows[0][psd.rows[0]['productivity']] * wbs.rows[0]['simpledatabase'] ) / (estimation)
        const Api = (uca.rows[0][pca.rows[0]['productivity']] * wbs.rows[0]['complexapi'] ) / (estimation) + (usa.rows[0][psa.rows[0]['productivity']] * wbs.rows[0]['simpleapi'] ) / (estimation)
        const Report = (ucr.rows[0][pcr.rows[0]['productivity']] * wbs.rows[0]['complexreport'] ) / (estimation) + (usr.rows[0][psr.rows[0]['productivity']] * wbs.rows[0]['simplereport'] ) / (estimation)
        const resource = await pool.query(`SELECT * from resource`)
        const Module1 = Screen / (resource.rows[0]['workingday'] * resource.rows[0]['phperday'])
        const Module2 = Database / (resource.rows[0]['workingday'] * resource.rows[0]['phperday'])
        const Module3 = Api / (resource.rows[0]['workingday'] * resource.rows[0]['phperday'])
        const Module4 = Report / (resource.rows[0]['workingday'] * resource.rows[0]['phperday'])
        const requirement = Module1 * (resource.rows[0]['requirement'] / 100) + Module2 * (resource.rows[0]['requirement'] / 100) + Module3 * (resource.rows[0]['requirement'] / 100) + Module4 * (resource.rows[0]['requirement'] / 100)
        const Design = Module1 * (resource.rows[0]['design'] / 100) + Module2 * (resource.rows[0]['design'] / 100) + Module3 * (resource.rows[0]['design'] / 100) + Module4 * (resource.rows[0]['design'] / 100)
        const coding = Module1 * (resource.rows[0]['coding'] / 100) + Module2 * (resource.rows[0]['coding'] / 100) + Module3 * (resource.rows[0]['coding'] / 100) + Module4 * (resource.rows[0]['coding'] / 100)
        const testing = Module1 * (resource.rows[0]['testing'] / 100) + Module2 * (resource.rows[0]['testing'] / 100) + Module3 * (resource.rows[0]['testing'] / 100) + Module4 * (resource.rows[0]['testing'] / 100)
        const deployment = Module1 * (resource.rows[0]['deployment'] / 100) + Module2 * (resource.rows[0]['deployment'] / 100) + Module3 * (resource.rows[0]['deployment'] / 100) + Module4 * (resource.rows[0]['deployment'] / 100)
        const r = await pool.query("SELECT * FROM requirement")
        const d = await pool.query("SELECT * FROM design")
        const c = await pool.query("SELECT * FROM coding")
        const t = await pool.query("SELECT * from testing")
        const de = await pool.query("SELECT * FROM deployment")
        const project = (await pool.query(`SELECT * from projectmanagement`)).rows[0]
       
        const salary = await pool.query("SELECT * from resourcecost")
        const maxValue = Math.max(requirement, Design, coding, testing, deployment)
        const onsite = Math.round(5 * maxValue/project.offshore * project.onsitesalary)
        const totalProject = Math.round((maxValue/project.teamemberratio * 5 * project.teamleadsalary) + ( maxValue/project.teamemberratio/ project.teamleadratio * 5 * project.pmsalary))

        
        const p =salary.rows[0]['permenentsalary']
        // console.log(p)
        const temp = salary.rows[0]['temporarysalary']
        const permenent = {
            requirement: Math.round((requirement * salary.rows[0]['permenent'] / 100) * p +  (requirement * salary.rows[0]['temporaryload'] / 100) * temp),
            design: Math.round(Design * salary.rows[0]['permenent'] / 100 * p+ (Design * salary.rows[0]['temporaryload'] / 100) * temp),
            coding: Math.round(coding * salary.rows[0]['permenent'] / 100 * p + (coding * salary.rows[0]['temporaryload'] / 100) * temp),
            testing: Math.round(testing * salary.rows[0]['permenent'] / 100 * p + (testing * salary.rows[0]['temporaryload'] / 100) * temp),
            deployment: Math.round(deployment * salary.rows[0]['permenent'] /100 * p + (deployment * salary.rows[0]['temporaryload'] / 100) * temp)
        }
        const sub1 = {
            design: Math.round(p * Design* (1 +(d.rows[0]['sub1']/100))),
            coding: Math.round(p * Design*  (1 +(c.rows[0]['sub1']/100))),
            testing: Math.round(p * Design*  (1 +(t.rows[0]['sub1']/100))),
            deployment: Math.round(p * Design* (1 +(de.rows[0]['sub1']/100))),
        }
        const sub2 = {
            design: Math.round(p * Design* (1 +(d.rows[0]['sub2']/100))),
            coding: Math.round(p * Design*  (1 +(c.rows[0]['sub2']/100))),
            testing: Math.round(p * Design*  (1 +(t.rows[0]['sub2']/100))),
            deployment: Math.round(p * Design* (1 +(de.rows[0]['sub2']/100))),
        }
        const sub3 = {
            design: Math.round(p * Design* (1 +(d.rows[0]['sub3']/100))),
            coding: Math.round(p * Design*  (1 +(c.rows[0]['sub3']/100))),
            testing: Math.round(p * Design*  (1 +(t.rows[0]['sub3']/100))),
            deployment: Math.round(p * Design* (1 +(de.rows[0]['sub3']/100))),
        }
        const subcost = {
            requirement: 0,
            design: d.rows[0]['subcontractor'] === 'none' ? 0: d.rows[0]['subcontractor'] === 'sub1' ? sub1.design : d.rows[0]['subcontractor'] === 'sub2'?sub2.design : sub3.design,
            coding: c.rows[0]['subcontractor'] === 'none' ? 0: c.rows[0]['subcontractor'] === 'sub1' ? sub1.coding : c.rows[0]['subcontractor'] === 'sub2'?sub2.coding : sub3.coding,
            testing: t.rows[0]['subcontractor'] === 'none' ? 0: t.rows[0]['subcontractor'] === 'sub1' ? sub1.testing : d.rows[0]['subcontractor'] === 'sub2'?sub2.testing : sub3.testing,
            deployment: de.rows[0]['subcontractor'] === 'none' ? 0: de.rows[0]['subcontractor'] === 'sub1' ? sub1.deployment : de.rows[0]['subcontractor'] === 'sub2'?sub2.deployment : sub3.deployment
        }
        const rcost = {
            requirement: subcost.requirement === 0? permenent.requirement : 0,
            design: subcost.design === 0 ? permenent.design : 0,
            coding: subcost.coding === 0 ? permenent.coding : 0,
            testing: subcost.testing === 0 ? permenent.testing : 0,
            deployment: subcost.deployment === 0 ? permenent.deployment : 0
        }
        const noOftotalcost = {
            requirement: subcost.requirement === 0 ? requirement * salary.rows[0]['permenent'] / 100 + requirement * salary.rows[0]['temporaryload'] / 100 : 0,
            design: subcost.design === 0 ? Design * salary.rows[0]['permenent'] / 100 + Design * salary.rows[0]['temporaryload'] / 100 : 0,
            coding: subcost.coding === 0 ? coding * salary.rows[0]['permenent'] / 100 + coding * salary.rows[0]['temporaryload'] / 100 : 0,
            testing: subcost.testing === 0 ? testing * salary.rows[0]['permenent'] / 100 + testing * salary.rows[0]['temporaryload'] / 100 : 0,
            deployment: subcost.deployment === 0 ? deployment * salary.rows[0]['permenent'] / 100 + deployment * salary.rows[0]['temporaryload'] / 100 : 0,
        }
        const inhouse = {
            requirement: contigencyCost[r.rows[0]['riskrating']],
            design:contigencyCost[d.rows[0]['riskrating']],
            coding:contigencyCost[c.rows[0]['riskrating']],
            testing:contigencyCost[t.rows[0]['riskrating']],
            deployment:contigencyCost[de.rows[0]['riskrating']]
        }
        const riskValue = await (await pool.query('SELECT * from riskrating')).rows[0]
        const subRisk = {
            requirement: contigencyCost[r.rows[0]['subcontractor']],
            design:contigencyCost[riskValue[d.rows[0]['subcontractor']]],
            coding:contigencyCost[riskValue[c.rows[0]['subcontractor']]],
            testing:contigencyCost[riskValue[t.rows[0]['subcontractor']]],
            deployment:contigencyCost[riskValue[de.rows[0]['subcontractor']]]
        }
     
        const contigency = {
            requirement:rcost.requirement * inhouse.requirement / 100 + subcost.requirement * subRisk.requirement /100,
            design: rcost.design * inhouse.design / 100 + subcost.design * subRisk.design/100,
            coding:rcost.coding * inhouse.coding / 100 + subcost.coding * subRisk.coding /100,
            testing: rcost.testing * inhouse.testing / 100 + subcost.testing * subRisk.testing /100,
            deployment: rcost.deployment * inhouse.deployment / 100 + subcost.deployment * subRisk.deployment /100
        }
        const {overhead, expectedprofit} = (await pool.query('SELECT * from bidsummary')).rows[0]
        const totalCotigency = Math.round(contigency.requirement + contigency.design + contigency.coding + contigency.testing + contigency.deployment)

        const totalSubContractRisk = rcost.requirement + rcost.design + rcost.coding + rcost.testing + rcost.deployment
        const totalSubCost = subcost.requirement + subcost.design + subcost.coding +  subcost.testing + subcost.deployment
        const totalNoOfCOST = noOftotalcost.requirement + noOftotalcost.design + noOftotalcost.coding + noOftotalcost.testing + noOftotalcost.deployment
        const {cost} = (await pool.query(`SELECT cost from infra`)).rows[0]
        const infra = Math.round(totalNoOfCOST * cost)
        const overHeadCost = (totalSubCost + totalSubContractRisk + infra + totalCotigency + onsite + totalProject) * overhead / 100
        const profit = ((totalSubCost + totalSubContractRisk + infra + totalCotigency + onsite + totalProject+overHeadCost + 11121 ) / (1 - expectedprofit /100)) - (totalSubCost + totalSubContractRisk + infra + totalCotigency + onsite + totalProject+overHeadCost + 11121)
        const bitPrice = overHeadCost + totalSubCost + totalSubContractRisk + infra + totalCotigency + onsite + totalProject +profit + 11121
        
        res.json(Math.round(bitPrice)).status(200)
    } catch (error) {
        console.log(error)
    }
})

app.get('/totalcontigency', async(req, res) => {
    try {
        const requirement = await (await pool.query("SELECT contigency from requirement")).rows[0]
        const design = await (await pool.query("SELECT contigency from design")).rows[0]
        const coding = await (await pool.query("SELECT contigency from coding")).rows[0]
        const testing = await (await pool.query("SELECT contigency from testing")).rows[0]
        const deployment = await (await pool.query("SELECT contigency from deployment")).rows[0]
        const total = requirement['contigency'] + design['contigency'] + coding['contigency'] + testing['contigency'] + deployment['contigency']
        res.json(total).status(200)
    } catch (error) {
        console.log(error)
    }
})

app.post('/changeproject', async(req, res) => {
    try {
       const {value1, value2, c1, c2} = req.body
       console.log(req.params)

       const response = await pool.query(`UPDATE projectmanagement SET ${c1} = $1, ${c2} = $2`,[value1, value2])
       res.sendStatus(200)
    } catch (error) {
        console.log(error)
    }
})

app.post('/changeprojectvalues', async(req, res) => {
    try {
        const {value, c1} = req.body
        console.log(req.body)
        const result = await pool.query(`UPDATE projectmanagement SET ${c1} = $1`,[value])
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
    }
})

app.post('/changebidsummary', async(req, res) => {
    try {
        const {value, column} = req.body
        const result = await pool.query(`UPDATE bidsummary SET ${column} = $1`, [value])
        res.sendStatus(200)
    } catch (error) {
        console.log(error)
    }
})

app.post('/infrachange', async(req, res) => {
    try {
        const {value, c} = req.body
        console.log(value)
        await pool.query(`UPDATE infra SET cost = $1`,[value])
        res.sendStatus(200)
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