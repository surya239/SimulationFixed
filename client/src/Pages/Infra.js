import React,{useState, useEffect} from "react";
import axios from "axios";
import Select from 'react-select'

function Infra(){
    const [options,setOptions] = useState([])
    const [defaultValue, setDefaultValue] = useState(0)
    const getValues = async() => {
        try {
            const response = axios.get(`http://localhost:5000/getinfra`)
            let data = []
            for(let i =0; i< (await response).data[0].length ; i++){
                data[i] = {
                    id: 1,
                    label:(await response).data[0][i],
                    value:(await response).data[0][i],
                }
            }
            setOptions(data)
            setDefaultValue((await response).data[1])
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getValues()
    }, [])
    return(
        <>
           {defaultValue === 0 ?null: <Select options={options} defaultValue={{id: 0, label: defaultValue, value: defaultValue}} /> }
        </>
    )
}

export default Infra