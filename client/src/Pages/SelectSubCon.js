import React,{useState, useEffect} from "react";
import Select from 'react-select'
import axios from "axios";
import Risk from "./Risk";

function SelectSubCon(){
    const [selectOptions, setSelectOptions] = useState([])
    // const [defaultrequirement, setDefaultRequirement] = useState('')
    const [defaultDesign, setDesign] = useState('')
    const [defaultCoding, setCoding] = useState('')
    const [defaultTesting, setDefaultTesting] = useState('')
    const [defaultDeployment, setDefaultDeployment] = useState('')
    const [state, setState] = useState(0)
    const getValues = async() => {
        try {
            const response = axios.get(`/selectsubcon`)
            const data = (await response).data[0]
            let dataArray = []
            for(var i =0; i<data.length; i++){
                dataArray[i] = {id: i, label: data[i], value: data[i]}
            }
            setSelectOptions(dataArray)

            setDesign((await response).data[1])
            setCoding((await response).data[2])
            setDefaultTesting((await response).data[3])
            setDefaultDeployment((await response).data[4])
            console.log(state)

        } catch (error) {
            console.log(error)
        }
    }
    const change = async(e,c1) => {
        try {
            const value = e.value
            console.log(e)
            const response = axios.post('/changesub', {value, c1})
            console.log((await response).data)
            setState(state + 1)
            window.location.reload(false);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getValues()
    },[state])
    return(
        <>

            <table>
                <thead>
                    <tr className="thead">
                    <th className="subsecond">Module</th>

                        <th className="subfirst">Select Sub Contractor</th>
                        {/* <th>Risk Rating</th>
                        <th>Sub Contract Cost</th>
                        <th>Resource Cost after Subcontracting</th>
                        <th>Number of Internal Resources after subcontracting</th> */}
                    </tr>
                    <tr className="tbody" >
                    <td className="subsecond">Requirement</td>
                        {<td className="subfirst" ><Select options={selectOptions} isDisabled={true} defaultValue={{id:0, label: 'None', value:'None'}} /></td>}
                        {/* <Risk name='requirement' state = {state} /> */}
                    </tr>
                    <tr className="tbody" >
                    <td className="subsecond">Design</td>

                        {defaultDesign === ''?null:<td className="subfirst"><Select options={selectOptions} defaultValue={{id:0,  value:defaultDesign, label: defaultDesign === 'none'? 'none':defaultDesign ==='sub1'? 'SubCon - 1': defaultDesign === 'sub2'?'SubCon - 2': defaultDesign ==='sub3'?'SubCon - 3':null }} onChange ={(e) => change(e, 'design')} /></td>}
                        {/* <Risk name='design' state = {state} /> */}

                    </tr>
                    <tr className="tbody" >
                    <td className="subsecond" >Coding</td>
                        {defaultCoding === ''?null:<td className="subfirst" ><Select options={selectOptions} defaultValue={{id:0 ,value:defaultCoding,label: defaultCoding === 'none'? 'none':defaultCoding ==='sub1'? 'SubCon - 1': defaultCoding === 'sub2'?'SubCon - 2': defaultCoding ==='sub3'?'SubCon - 3':'SubCon' }} onChange={(e) => change(e, 'coding')} /></td>}
                        {/* <Risk name='coding' state = {state} /> */}

                    </tr>
                    <tr className="tbody" >
                    <td className="subsecond">Testing</td>

                    {defaultTesting === ''?null:<td className="subfirst" ><Select options={selectOptions} defaultValue={{id:0, value:defaultTesting, label: defaultTesting === 'none'? 'none':defaultTesting ==='sub1'? 'SubCon - 1': defaultTesting === 'sub2'?'SubCon - 2': defaultTesting ==='sub3'?'SubCon - 3':'SubCon'}} onChange={(e) => change(e,'testing')} /></td>}

                        {/* <Risk name='testing' state = {state} /> */}

                    </tr>
                    <tr className="tbody">
                    <td className="subsecond" >Deployment</td>

                        {defaultDeployment === ''? null:<td className="subfirst" ><Select options={selectOptions} defaultValue={{id:0, value:defaultDeployment, label: defaultDeployment === 'none'? 'None':defaultDeployment ==='sub1'? 'SubCon - 1': defaultDeployment === 'sub2'?'SubCon - 2': defaultDeployment ==='sub3'?'SubCon - 3':null}} onChange={(e) => change(e,'deployment')} /></td>}

                        {/* <Risk name='deployment' state = {state} /> */}

                    </tr>
                   
                </thead>
            </table>
        </>
    )
}

export default SelectSubCon