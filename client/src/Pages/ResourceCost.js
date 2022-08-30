import React,{useEffect, useState} from "react";
import axios from "axios";
import Select from 'react-select'
import Pvst from "./Pvst";
import TotalResource from "./TotalResource";
import GettotalResource from "./GettotalResource";
import BidPrice from "./BidPrice";
function ResourceCost(){
    const [changeState, setChangeState] = useState(0)
    const [pvslOption, setPvslOption] = useState([])
    const [permanentSalary, setPermanentSalary] = useState([])
    const [temporary, setTemporarySalary] = useState([])
    const [defaultpvst, setDefaultpvst] = useState('')
    const [defaultPermanentSalary, setDefaultPermanentSalary] = useState(0)
    const [defaultTemporarySalary, setDefaultTemporarySalary] = useState(0)
    const [pload, setPload] = useState('')
    const [tload, setTload] = useState('')
    const getValues = async() => {
        try {
            const response = axios.get("/resourcecostvalues")
            const pvsl = (await response).data[0]
            const psalary = (await response).data[1]
            const tsalary = (await response).data[2]
            let data = []
            for(let i =0; i<pvsl.length; i++){
                data[i] = {id: i, label:pvsl[i], value: pvsl[i]}
            }
            setPvslOption(data)
            data = [];
            for(let i =0; i<psalary.length; i++){
                data[i] = {id: i, label:psalary[i], value: psalary[i]}
            }
            setPermanentSalary(data)
            data = [];
            for(let i =0; i<tsalary.length; i++){
                data[i] = {id: i, label:tsalary[i], value: tsalary[i]}
            }
            setTemporarySalary(data)
            const DefaultValues = (await response).data[3]
            setDefaultpvst(String(DefaultValues[0].permenent)+'-'+String(DefaultValues[0].temporaryload))
            setDefaultPermanentSalary(DefaultValues[0].permenentsalary)
            setDefaultTemporarySalary(DefaultValues[0].temporarysalary)
            setPload(DefaultValues[0].permenent)
            setTload(DefaultValues[0].temporaryload)
            console.log(DefaultValues)
        } catch (error) {
            console.log(error)
        }
    }
    const change = async(e, coloumn) => {
        try {
            console.log(e)
            const label = e.label
            if(coloumn ==='pvst' ){
                const value = e.label.split('-')
                setPload(value[0])
                setTload(value[1])
            }
            const response = axios.post("/changeresourcecost",{coloumn, label})
            setChangeState(changeState+1)
            window.location.reload(false);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getValues()
    }, [changeState])
    return(
        <>
        
        <div className="effort" >
        <div  >
                <h4>Permanent VS Temporary Load</h4>
                {defaultpvst === ''? null :<Select options={pvslOption} onChange={(e) => change(e, 'pvst')} defaultValue={{id: 7, label: defaultpvst, value:defaultpvst}}/>}
            </div>
            <div>
                <h4>Permanent  Monthly Sal USD</h4>
                {defaultPermanentSalary===0 ?null:<Select options={permanentSalary} onChange={(e) => change(e,'parmenentsalary')} defaultValue={{id:4, label: defaultPermanentSalary, value: defaultPermanentSalary}} />}
            </div>
            <div>
                <h4>Temporary  Monthly Sal USD</h4>
                {defaultTemporarySalary === 0?null: <Select options={temporary} onChange={(e) => change(e, 'temporarysalary') } defaultValue={{id:4, label: defaultTemporarySalary, value: defaultTemporarySalary}} />}
            </div>
        </div>
            
            <div>
                {/* <table>
                    <tbody>
                        <tr>
                            <th>Permanent Staff</th>
                            <td>{pload} %</td>
                            <Pvst name='requirement' load = {'permenent'}/>
                            <Pvst name='design' load = {'permenent'}/>
                            <Pvst name='coding' load = {'permenent'}/>
                            <Pvst name='testing' load = {'permenent'}/>
                            <Pvst name='deployment' load = {'permenent'}/>
                            <Pvst name='total' load = {'permenent'}/>

                        </tr>
                        <tr>
                            <th>Temporary Staff</th>
                            <td>{tload} %</td>
                            <Pvst name='requirement' load = {'temporaryload'}/>
                            <Pvst name='design' load = {'temporaryload'}/>
                            <Pvst name='coding' load = {'temporaryload'}/>
                            <Pvst name='testing' load = {'temporaryload'}/>
                            <Pvst name='deployment' load = {'temporaryload'}/>
                            <Pvst name='total' load = {'temporaryload'}/>
                        </tr>
                        <tr>
                            <th>Resource Cost</th>
                            <td></td>
                            <TotalResource name='requirement' />
                            <TotalResource name='design' />
                            <TotalResource name='coding' />
                            <TotalResource name='testing' />
                            <TotalResource name='deployment' />
                        </tr>
                        <tr>
                            <th>Total Resource Cost before subcontracting</th>
                            <GettotalResource />
                        </tr>
                    </tbody>
                </table> */}
            </div>
        </>
    )
}

export default ResourceCost