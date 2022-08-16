import React,{useEffect, useState} from "react";
import axios from "axios";

function SubcontractModule(params){
    const {name} = params
    const [value, setValue] = useState([])
    const getValues = async() => {
        try {
            const response = axios.get(`/getsubcontraccost/${name}`)
            const data = (await response).data
            setValue(data)
        
            // console.log(value)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        getValues()
    }, [])
    return(
        <>
{/* <td>Hi</td> */}
            <td>{value[0]}</td>
            <td>{value[1]}</td>
            <td>{value[2]}</td>

        </>
    )
}

export default SubcontractModule