import React,{useEffect, useState} from "react";
import axios from "axios";
function GettotalResource(){
    const [total, setTotal] = useState(0)
    const getValues = async() => {
        try {
            const response = axios.get(`/gettotalresourcecost`)
            setTotal((await response).data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() =>{
        getValues()
    }, [])

    return(
        <>
            <td>{total}</td>
        </>
    )
}

export default GettotalResource
