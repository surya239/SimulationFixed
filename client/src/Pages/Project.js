import React,{useEffect, useState} from "react";
import axios from "axios";
import Select from 'react-select'
import BidPrice from "./BidPrice";

function Project(){
    const [teamRatio, setTeamRatio] = useState([])
    const [defaultTeamRatio, setDefaultTeamRatio] = useState('')
    const [noOfTeamMembers, setNoOfTeamMembers] = useState(0)
    const [noOfTeamLeads, setNoOfTeamLeads] = useState(0)
    const [costOfMonths, setCostOfMonths] = useState(0)
    const [teamleadsalary, setTeamLeadSalary] = useState([])
    const [defaultTeamLeadSalary , setDefaultTeamLeadSalary] = useState(0)
    const [teamLeadRatio, setteamLeadRatio] = useState([])
    const [defaultTeamLeadRatio, setDefaultTeamLeadRatio] = useState('')
    const [noOfTeamLeadsCount, setNoOfTeamLeadsCount] = useState(0)
    const [noOfManager, setNoOfManager] = useState(0)
    const [projectManagerCost, setprojectManagerCost] = useState(0)
    const [pmSalary, setPmSalary] = useState([])
    const [defaultPmsalary, setDefaultPmSAlary] = useState(0)
    const [Heuristic, setHeuristic] = useState([])
    const [defaultHeuristic, setdefaultHeuristic] = useState(0)
    const [costHeuristic, setCostHeuristic] = useState(0)
    const [onsite, setOnsite] =  useState([])
    const [defaultonsite, setDefaultonsite] = useState('')
    const [onSite, setOnSite] = useState(0)
    const [maxValue, setMaxValue] = useState(0)
    const [onsiteSalary, setOnsiteSalary] = useState([])
    const [defaultOnsiteSalary, setDefaultOnsiteSalary] = useState(0)
    const [onsiteCost, setOnsiteCost] = useState(0)
    const getValues = async() => {
        try {
            const result = axios.get(`http://localhost:5000/getproject`)
            console.log((await result).data)
            const data = (await result).data[0]
            let dataArray = []
            for(var i = 0; i<data.length; i++){
                dataArray[i] = {id: i, label: data[i], value: data[i]}
            }
            setTeamRatio(dataArray)
            setDefaultTeamRatio((await result).data[1])
            setNoOfTeamMembers((await result).data[2])
            setNoOfTeamLeads((await result).data[3])
            setCostOfMonths((await result).data[4])
             dataArray = []
            for(var i = 0; i<(await result).data[5].length; i++){
                dataArray[i] = {id: i, label: (await result).data[5][i], value: (await result).data[5][i]}
            }
            
            setTeamLeadSalary(dataArray)
            setDefaultTeamLeadSalary((await result).data[6])
            dataArray = []
            for(var i = 0; i<(await result).data[8].length; i++){
                dataArray[i] = {id: i, label: (await result).data[8][i], value: (await result).data[8][i]}
            }
            setteamLeadRatio(dataArray)
            setNoOfTeamLeadsCount((await result).data[7])
            setNoOfManager((await result).data[9])
            setprojectManagerCost((await result).data[10])
            setDefaultTeamLeadRatio((await result).data[11])
            dataArray = []
            for(var i = 0; i<(await result).data[12].length; i++){
                dataArray[i] = {id: i, label: (await result).data[12][i], value: (await result).data[12][i]}
            }
            setPmSalary(dataArray)
            dataArray = []
            for(var i = 0; i<(await result).data[14].length; i++){
                dataArray[i] = {id: i, label: String((await result).data[14][i]) + ' %', value:String( (await result).data[14][i]) + ' %'}
            }
            setDefaultPmSAlary((await result).data[13])
            setHeuristic(dataArray)
            setdefaultHeuristic(String((await result).data[15])+ ' %')
            setCostHeuristic((await result).data[16])
            dataArray = []
            for(var i = 0; i<(await result).data[17].length; i++){
                dataArray[i] = {id: i, label: (await result).data[17][i], value: (await result).data[17][i]}
            }
            setOnsite(dataArray)
            setDefaultonsite((await result).data[18])
            setOnSite((await result).data[19])
            setMaxValue((await result).data[20])
            dataArray = []
            for(var i = 0; i<(await result).data[21].length; i++){
                dataArray[i] = {id: i, label: (await result).data[21][i], value: (await result).data[21][i]}
            }
            setOnsiteSalary(dataArray)
            setDefaultOnsiteSalary((await result).data[22])
            setOnsiteCost((await result).data[23])
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getValues()
    }, [])
    return(
        <>
        <BidPrice />
            <h3>Project Management</h3>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Team Leader - Team Member Ratio</th>
                            <th>Number of Team members per team</th>
                            <th>Number of Team Leads</th>
                            <th>Team Lead Cost for 5 months</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                               { defaultTeamRatio===''?null :<Select options={teamRatio} defaultValue={{id:6, label:defaultTeamRatio, value: defaultTeamRatio} }/>}
                            </td>
                            <td>{noOfTeamMembers}</td>
                            <td>{noOfTeamLeads}</td>
                            <td>{costOfMonths}</td>
                        </tr>
                        <tr>
                            <th>Team Lead Salary</th>
                        </tr>
                        <tr>
                            <td>{defaultTeamLeadSalary === 0?null:<Select options={teamleadsalary} defaultValue={{id:0, label:defaultTeamLeadSalary, value: defaultTeamLeadSalary}} />}</td>
                           
                        </tr>
                        <tr>
                            <th>Project Manager - Team Lead Ratio</th>
                            <td>Number of Team Leads per manager</td>
                            <td>Number of Managers</td>
                            <td>Project Manager Cost for 5 Months </td>
                        </tr>
                        <tr>
                            <td>
                                {defaultTeamLeadRatio === ''?null:<Select options={teamLeadRatio} defaultValue={{id:5, label:defaultTeamLeadRatio, value: defaultTeamLeadRatio}} />}
                            </td>
                            <td>{noOfTeamLeadsCount}</td>
                            <td>{noOfManager}</td>
                            <td>{projectManagerCost}</td>
                        </tr>
                        <tr>
                            <th>PM Salary</th>
                        </tr>
                        <tr>
                            {defaultPmsalary === 0?null:<Select options={pmSalary} defaultValue={{id:4, label:defaultPmsalary, value:defaultPmsalary}} />}
                        </tr>
                        <tr>
                            <td></td>
                            <td>Project Management Cost - Cal</td>
                            <td>{costOfMonths + projectManagerCost}</td>
                        </tr>
                        <tr>
                            <th>Heuristic</th>
                            <td></td>
                            <td>Project Management Cost - Heriustic</td>
                        </tr>
                        <tr>
                            <td>
                                {defaultHeuristic === 0?null:<Select options={Heuristic} defaultValue={{id:1, label:defaultHeuristic, value:defaultHeuristic}} />}
                            </td>
                            <td></td>
                            <td>{Math.round(costHeuristic)}</td>
                        </tr>
                        <tr>
                            <th>Onsite</th>
                        </tr>
                        <tr>
                            <td>Onsite-Offshore Support Ratio</td>
                            <td></td>
                            <td>Number of Onsite Coordinators</td>
                            <td>Onsite Coordinator Cost for 5 Months </td>
                        </tr>
                        <tr>
                            <td>{defaultonsite === ''?null:<Select options={onsite} defaultValue={{id:1, label: defaultonsite, id: defaultonsite}} />}</td>
                            <td>{onSite}</td>
                            <td>{maxValue / onSite}</td>
                            <td>{Math.round(onsiteCost * (maxValue / onSite) )}</td>
                        </tr>
                        <tr>
                            <td>Onsite Coordinator Salary</td>
                        </tr>
                        <tr>
                            <td>
                                {defaultOnsiteSalary === 0?null:<Select options={onsiteSalary} defaultValue={{id:0, label:defaultOnsiteSalary, value: defaultOnsiteSalary}} />}
                            </td>
                        </tr>
                    </tbody>
                </table>

            </div>
            
        </>
    )
}

export default Project