import React,{useEffect, useState} from "react";
import axios from "axios";

function Pvst(params){
    const [value, setValue] = useState(0)
    const {name, load} =  params
    const getValues = async() => {
        try {
            const result = axios.get(`/getresourcecost/${name}/${load}`)
            const data = (await result).data
            setValue(data)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getValues()
    },[])
    return(
        <td>{value}</td>
    )
}

export default Pvst