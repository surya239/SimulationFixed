import React,{useEffect, useState} from "react";
import axios from "axios";
import Select from 'react-select'

function Contigency(params){
    const {name} = params
    const [options, setOptions] = useState([])
    const [defaultValue, setDefaultValue] = useState('')
    const [inhouse, setInhouse] = useState(0)
    const getValues = async() => {
        try {
            const response = axios.get(`http://localhost:5000/contigency/${name}`)
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
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        getValues()
    },[])
    return(
        <>
            
           <td> {defaultValue === ''?null:<Select options={options} defaultValue={{id:0, label: defaultValue, value: defaultValue}} />}</td>
           <td>{params.module}</td>
           <td>{inhouse}%</td>
        </>
    )
}

export default Contigency