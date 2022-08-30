import React,{useEffect, useState} from "react";
import axios from "axios";
import Select from 'react-select'

function Contigency(params){
    const {name} = params
    const [options, setOptions] = useState([])
    const [defaultValue, setDefaultValue] = useState('')
    const [inhouse, setInhouse] = useState(0)
    const [risk, setRisk] = useState('')
    const [subRisk, setSubRisk] = useState(0)
    const [contigency, setContigency] = useState(0)
    const [state, setState] = useState(0)
    const getValues = async() => {
        try {
            const response = axios.get(`/contigency/${name}`)
            let data = []
            for(var i = 0; i<(await response).data[0].length; i++){
                data[i]={
                    id: i,
                    label: (await response).data[0][i],
                    value: (await response).data[0][i]
                }
            }
            setOptions(data)
            setDefaultValue((await response).data[1])
            setInhouse((await response).data[2])
            setRisk((await response).data[3])
            setSubRisk((await response).data[4])
            setContigency((await response).data[5])
        } catch (error) {
            console.error(error)
        }
    }
    const change = async(e, name) => {
        const label = e.value
        try {
            const response = axios.post('/changecontigency', {label, name})
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
            <td className="subsecond" >{params.module}</td>
           <td className="subfirst"> {defaultValue === ''?null:<Select options={options} defaultValue={{id:0, label: defaultValue, value: defaultValue}} onChange={(e) => change(e, name)} />}</td>
        </>
    )
}

export default Contigency