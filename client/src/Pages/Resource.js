import React,{useEffect, useState} from "react";
import axios from "axios";
import Select from "react-select";
import Module from './Module'
import R from "./R";
import BidPrice from "./BidPrice";
import ResourceCost from "./ResourceCost";
function Resource(){
    const [changestate, setChangeState] = useState(0)
    const [lifeCycle, setLifeCycle] = useState([])
    const [WPM, setWPM] = useState([])
    const [WPH, setWPH] = useState([])
    const [state, setState] = useState(1)
    const [requirement, setRequirement] = useState({})
    const [changeLifeCycle,setChangeLifeCycle] = useState('')
    const [changeWM, setChangeWM] = useState(0)
    const [changeWH, setChangeWH] = useState(0)
    const setData = async(data, req) =>{
        let L = []
        let WM = []
        let WH = []
         setRequirement(req)
        for(let i =0; i<data.length; i++){
           L[i] = {
            id:i,
            label:data[i].lifecycle,
            value:data[i].lifecycle
        }
        WM[i] = {
            id:i,
            label:data[i].wm,
            value:data[i].wm
        }
        WH[i] = {
            id:i,
            label:data[i].wd,
            value:data[i].wd
        }
        }
        setLifeCycle(L)
        console.log(data)
        setWPM(WM)
        setWPH(WH)
    }
    const gethefault = async() => {
        try {
            const response = axios.get(`/getresource/${'abc@gmail.com'}`)
            const data = (await response).data[0]
            setData(data, (await response).data[1])
            const d = (await response).data[2]
            setChangeLifeCycle(d[0].lifecycle)
            setChangeWM(d[0].workingday)
            setChangeWH(d[0].phperday)
            console.log((await response).status)
        } catch (error) {
            console.log(error)
        }
    }
    const change = (e,table) =>{
        const label = e.label
        if(table === 'lifecycle'){
            setChangeLifeCycle(label)
        }
        else if(table === 'workingday'){
            setChangeWM(label)
        }
        else if(table === 'phperday'){
            setChangeWH(label)
        }
        try {
            const response = axios.post("/changeresource",{table:table, value:label})
            setChangeState(changestate + 1)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
         gethefault()
    },[changeLifeCycle])
    return(
        <>
        <div className="Dash">
            <div className="n">
            <h1>Calculate Resources</h1>

            </div>
            <div>
        <BidPrice name={changestate}/>

            </div>
        </div>
        <div className="effort" >
        <div>
                <h4>Select Life Cycle Effort Distribution</h4>
                {changeLifeCycle.length === 0?null:<Select options={lifeCycle} defaultValue={{id:4, label:changeLifeCycle, value:changeLifeCycle}} onChange = {e => change(e, 'lifecycle')} />}
            </div>
            <div>
                <h4>Working days per Months </h4>
                {changeWM === 0 ? null:<Select options={WPH} defaultValue={{id:4, label:changeWM, value:changeWM}} onChange={e => change(e,'workingday')} />}

            </div>
            <div>
                <h4>Productive  hours per day</h4>
                {changeWH === 0 ?null:<Select options={WPM} defaultValue={{id:4, label:changeWH, value:changeWH}} onChange= {e => change(e,'phperday')}/>}
            </div>
        </div>
            
            {/* <table>
                <thead>
                    <tr>
                        <th></th>
                        <th></th>
                        <th>Month 1 Requirements</th>
                        <th>Month 2 Design</th>
                        <th>Month 3 Coding</th>
                        <th>Month 4 Testing</th>
                        <th>Month 5 Deployment</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td></td>
                        <th>Module Resource Requirement</th>
                        <td>{requirement.resource}%</td>
                        <td>{requirement.design}%</td>
                        <td>{requirement.coding}%</td>
                        <td>{requirement.testing}%</td>
                        <td>{requirement.deployment}%</td>
                        <td>{requirement.total}%</td>
                    </tr>
                    <Module name ='Module - 1' set={0} type = 'screen' WM = {changeWM} WH= {changeWH} lifcycle={changeLifeCycle} />
                    <Module name = 'Module - 2' set={1} type='database' WM = {changeWM} WH= {changeWH} lifcycle={changeLifeCycle}/>
                    <Module name='Module -3'set={2}  type='api' WM = {changeWM} WH= {changeWH} lifcycle={changeLifeCycle}/>
                    <Module name = 'Module - 4' set={3}  type='report' WM = {changeWM} WH= {changeWH} lifcycle={changeLifeCycle}/>
                    <tr>
                        <td>Milestone Resource Requirement</td>
                        <td></td>
                        <R name='requirement' />
                        <R name='design' />
                        <R name='coding'/>
                        <R name="testing " />
                        <R name="deployment" />
                        <R name='total' />
                    </tr>
                </tbody>
            </table> */}
            <ResourceCost />
        </>
    )
}

export default Resource