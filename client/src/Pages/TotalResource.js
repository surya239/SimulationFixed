import React,{useEffect, useState} from "react";
import axios from "axios";

function TotalResource(params){
    const {name} = params
    const [total, setTotal] = useState(0)
    const getValues = async() => {
        try {
            const response = axios.get(`http://localhost:5000/gettotalresource/${name}`)
            const data = (await response).data
            setTotal(data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getValues()
    }, [])
    return(
        <>
            <td>{total}</td>
        </>
    )
}

export default TotalResource