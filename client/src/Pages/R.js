// import { get } from "mongoose";
import React,{useEffect, useState} from "react";
import axios from "axios";

function R(params){
    const {name} = params
    const [total, setTotal] = useState(0)
    const getValues = async() => {
        try {
            const result = axios.get(`/milestoneresource/${name}`)
            const data = (await result).data
            setTotal(data)
            console.log((await result).data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getValues();
    }, [])
    return(
        <td>
            {total}
        </td>
    )
}

export default R