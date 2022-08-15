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
    const getValues = async() => {
        try {
            const response = axios.get(`http://localhost:5000/selectsubcon`)
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

        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getValues()
    },[])
    return(
        <>
            <table>
                <thead>
                    <tr>
                        <th>Select Sub Contractor</th>
                        <th>Module</th>
                        <th>Risk Rating</th>
                        <th>Sub Contract Cost</th>
                        <th>Resource Cost after Subcontracting</th>
                        <th>Number of Internal Resources after subcontracting</th>
                    </tr>
                    <tr>
                        {<td><Select options={selectOptions} isDisabled={true} defaultValue={{id:0, label: 'None', value:'None'}} /></td>}
                        <td>Requirement</td>
                        <Risk name='requirement' />
                    </tr>
                    <tr>
                        {defaultDesign === ''?null:<td><Select options={selectOptions} defaultValue={{id:0, label: defaultDesign === 'none'? 'None':defaultDesign ==='sub1'? 'SubCon - 1': defaultDesign === 'sub2'?'SubCon - 2': defaultDesign ==='sub3'?'SubCon - 3':null }} /></td>}
                        <td>Design</td>
                        <Risk name='design' />

                    </tr>
                    <tr>
                        {defaultCoding === ''?null:<td><Select options={selectOptions} defaultValue={{id:0, label: defaultCoding === 'none'? 'None':defaultCoding ==='sub1'? 'SubCon - 1': defaultCoding === 'sub2'?'SubCon - 2': defaultCoding ==='sub3'?'SubCon - 3':'SubCon'}} /></td>}
                        <td>Coding</td>
                        <Risk name='coding' />

                    </tr>
                    <tr>
                    {defaultTesting === ''?null:<td><Select options={selectOptions} defaultValue={{id:0, label: defaultTesting === 'none'? 'None':defaultTesting ==='sub1'? 'SubCon - 1': defaultTesting === 'sub2'?'SubCon - 2': defaultTesting ==='sub3'?'SubCon - 3':'SubCon'}} /></td>}

                        <td>Testing</td>
                        <Risk name='testing' />

                    </tr>
                    <tr>
                        {defaultDeployment === ''? null:<td><Select options={selectOptions} defaultValue={{id:0, label: defaultDeployment === 'none'? 'None':defaultDeployment ==='sub1'? 'SubCon - 1': defaultDeployment === 'sub2'?'SubCon - 2': defaultDeployment ==='sub3'?'SubCon - 3':null}}  /></td>}

                        <td>Deploymentt</td>
                        <Risk name='deployment' />

                    </tr>
                    <tr>
                      
                    </tr>
                </thead>
            </table>
        </>
    )
}

export default SelectSubCon