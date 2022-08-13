import React,{useEffect, useState} from "react";
import axios from "axios";
import Select from 'react-select'


function SelectProductivity(params){
    const [option, setOption] = useState([])
    const [defaultValue, setDefaultValue] = useState('')
    const [effort, setEffort] = useState(0)
    const [state, setState] = useState(0)
    const {name} = params
    const change = async(e) => {
        try {
            const label = e.label
            const response = axios.post(`http://localhost:5000/changeproductivity/${name}`,{label})
            console.log((await response).data)
            setState(state+1)
        } catch (error) {
            console.log(error)
        }
    }
    const getValues = async() => {
        try {
            const response = axios.get(`http://localhost:5000/productivity/${name}/${'abc@gmail.com'}`)
            const data = (await response).data[0]
            setDefaultValue((await response).data[1])
            setOption([{
                id:1,
                value:data[0]['productivity'],
                label:data[0]['productivity']
            },{
                id:2,
                value:data[1]['productivity'],
                label:data[1]['productivity']
            },{
                id:3,
                value:data[2]['productivity'],
                label:data[2]['productivity']
            }])
            setEffort((await response).data[2])
            console.log((await response).data)
            console.log(defaultValue)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getValues()
    }, [state])
    return(
        <>
            <td>{defaultValue === ''?null:<Select options={option} onChange={e => change(e)} defaultValue={{id:0, label: defaultValue, value: defaultValue}} />}</td>
            <td>{effort}</td>
        </>
    )
}

export default SelectProductivity